import { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import apiCall from '../../lib/server/api-call'
import { getTokenCookie } from '../../lib/server/auth-cookies'

// This endpoint is only used to transform client requests (which have their
// JWT token in an HttpOnly cookie) into request with Authorization Bearer tokens.
// It's basically forwarding the request to the Hasura API.

export default async (req: Req, res: Res) => {
  const apiResponse = await apiCall(req.body, getTokenCookie(req))
  res.status(apiResponse.status).json(await apiResponse.json())
}
