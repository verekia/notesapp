import { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import { GraphQLClient } from 'graphql-request'
import { getSession } from '../../lib/server/iron'

// This endpoint is only used by SWR to transform the request with
// a cookie into an authenticated request to Hasura.
// Switch to JWT later.

export default async (req: Req, res: Res) => {
  console.log('In converter')
  console.log(req.body)

  const userId = (await getSession(req))?.userId

  const headers = {}

  if (userId) {
    headers['X-Hasura-Role'] = 'user'
    headers['X-Hasura-User-ID'] = userId
  } else {
    headers['X-Hasura-Role'] = 'public'
  }

  const graphQLClient = new GraphQLClient(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
    headers,
  })

  res.status(200).json({ ok: true })
}
