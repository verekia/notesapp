import id from '@sharyn/nanoid'
import {
  ApolloServer,
  gql,
  makeExecutableSchema,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-micro'
import { GraphQLClient } from 'graphql-request'

import { CREATE_NOTE_MUTATION } from '../../lib/client/queries'
import { setTokenCookie, removeTokenCookie } from '../../lib/server/auth-cookies'
import magic from '../../lib/server/magic'
import { GET_USER_QUERY, CREATE_USER_MUTATION } from '../../lib/client/queries'
import { createJWT, decodeJWT } from '../../lib/server/jwt'

const client = new GraphQLClient(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
  headers: { Authorization: `Bearer ${process.env.CUSTOM_API_JWT}` },
})

const typeDefs = gql`
  type Query {
    randomNumber: Int!
  }
  type Mutation {
    refreshToken: Boolean
    login(didToken: String!): Boolean
    logout: Boolean
    createNote(title: String!, content: String): String!
  }
`

const resolvers = {
  Query: {
    randomNumber: () => Math.round(Math.random() * 10),
  },
  Mutation: {
    async refreshToken(_, __, { jwtPayload, res, role, userId }) {
      if (role === 'public' || !userId || !jwtPayload) {
        return false
      }
      setTokenCookie(
        res,
        createJWT({
          issuer: jwtPayload.issuer,
          publicAddress: jwtPayload.publicAddress,
          email: jwtPayload.email,
          userId,
        })
      )
      return true
    },
    async login(_, { didToken }, { res }) {
      const metadata = await magic.users.getMetadataByToken(didToken)
      const { user: users } = await client.request(GET_USER_QUERY, { email: metadata.email })
      let foundUser: any = users[0]
      if (!foundUser) {
        const { insert_user_one: createdUser } = await client.request(CREATE_USER_MUTATION, {
          email: metadata.email,
        })
        foundUser = createdUser
      }
      setTokenCookie(res, createJWT({ ...metadata, userId: foundUser.id }))
      return true
    },
    async logout(_, __, { jwtPayload, res }) {
      if (jwtPayload) {
        const { issuer } = jwtPayload
        issuer && (await magic.users.logoutByIssuer(issuer))
      }
      removeTokenCookie(res)
      return true
    },
    async createNote(_, { title, content }, { role, userId }) {
      if (role === 'public' || !userId) {
        throw new AuthenticationError('Unauthenticated')
      }
      const { insert_note_one: note } = await client.request(CREATE_NOTE_MUTATION, {
        title,
        content,
        slug: id(8),
        userId,
      })
      return note.id
    },
  },
}

// @ts-ignore
export const schema = makeExecutableSchema({ typeDefs, resolvers })

export const config = { api: { bodyParser: false } }

export default new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: (ctx) => {
    if (
      process.env.STAGE !== 'dev' &&
      ctx.req.headers['custom-api-hasura-secret'] !== process.env.CUSTOM_API_HASURA_SECRET
    ) {
      throw new ForbiddenError('Invalid custom-api-hasura-secret header')
    }
    let jwtPayload = ctx.req.headers.authorization
      ? decodeJWT(ctx.req.headers.authorization.split(' ')[1])
      : null
    return {
      ...ctx,
      jwtPayload,
      role: ctx.req.headers['x-hasura-role'],
      userId: ctx.req.headers['x-hasura-user-id'],
    }
  },
}).createHandler({ path: '/api/graphql' })
