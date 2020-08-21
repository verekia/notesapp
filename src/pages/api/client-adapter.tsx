import { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import { getSession } from '../../lib/server/iron'
import apiCall from '../../lib/server/api-call'

// This endpoint is only used by SWR to transform the request with
// a cookie into an authenticated request to Hasura.
// Switch to JWT or webhook later.

export default async (req: Req, res: Res) => {
  const userId = (await getSession(req))?.userId
  const apiResponse = await apiCall(req.body, userId)
  res.status(apiResponse.status).json(await apiResponse.json())
}
