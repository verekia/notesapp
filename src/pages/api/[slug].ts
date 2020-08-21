import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

import { setTokenCookie, removeTokenCookie, getTokenCookie } from '../../lib/server/auth-cookies'
import magic from '../../lib/server/magic'
import { GraphQLClient } from 'graphql-request'
import { GET_USER_QUERY, CREATE_USER_MUTATION } from '../../lib/client/queries'
import { createJWT, decodeJWT } from '../../lib/server/jwt'

export default async (req: Req, res: Res) => {
  const { slug } = req.query

  const client = new GraphQLClient(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
    headers: { Authorization: `Bearer ${process.env.AUTH_SERVICE_JWT}` },
  })

  switch (slug) {
    case 'login':
      try {
        const didToken = req.body
        const metadata = await magic.users.getMetadataByToken(didToken)
        const { user: users } = await client.request(GET_USER_QUERY, { email: metadata.email })
        let foundUser: any = users[0]
        if (!foundUser) {
          const { insert_user_one: createdUser } = await client.request(CREATE_USER_MUTATION, {
            email: metadata.email,
          })
          foundUser = createdUser
        }
        const authToken = createJWT({ ...metadata, userId: foundUser.id })
        setTokenCookie(req, res, authToken)
        res.status(200).end()
      } catch (error) {
        res.status(error.status || 500).end(error.message)
      }
      break
    case 'logout':
      const token = getTokenCookie(req)
      if (token) {
        const { issuer } = decodeJWT(token)
        issuer && (await magic.users.logoutByIssuer(issuer))
      }
      removeTokenCookie(res)
      res.writeHead(302, { Location: '/' }).end()
      break
    default:
      res.status(404).end()
      break
  }
}
