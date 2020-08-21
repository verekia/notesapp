import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

import { getSession } from '../../lib/server/iron'
import { setTokenCookie, removeTokenCookie } from '../../lib/server/auth-cookies'
import { encryptSession } from '../../lib/server/iron'
import magic from '../../lib/server/magic'
import { GraphQLClient } from 'graphql-request'
import { GET_USER_QUERY, CREATE_USER_MUTATION } from '../../lib/client/queries'

// This endpoint is only used by SWR

export default async (req: Req, res: Res) => {
  const { slug } = req.query

  const client = new GraphQLClient(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
    headers: { 'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET },
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
        const session = { ...metadata, userId: foundUser?.id }
        const authToken = await encryptSession(session)
        setTokenCookie(req, res, authToken)
        res.status(200).end()
      } catch (error) {
        res.status(error.status || 500).end(error.message)
      }
      break
    case 'logout':
      const issuer = (await getSession(req))?.issuer
      issuer && (await magic.users.logoutByIssuer(issuer))
      removeTokenCookie(res)
      res.writeHead(302, { Location: '/' }).end()
      break
    default:
      res.status(404).end()
      break
  }
}
