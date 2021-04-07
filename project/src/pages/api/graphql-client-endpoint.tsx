import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

import apiCall from '../../lib/server/api-call'
import { getTokenCookie } from '../../lib/server/auth-cookies'

export default async (req: Req, res: Res) => {
  const apiResponse = await apiCall(req.body, getTokenCookie(req))
  // The response does not seem gzipped which causes ERR_CONTENT_DECODING_FAILED
  // if (apiResponse.headers.get('content-encoding')) {
  //   res.setHeader('content-encoding', apiResponse.headers.get('content-encoding'))
  // }
  if (apiResponse.headers.get('set-cookie')) {
    res.setHeader('set-cookie', apiResponse.headers.get('set-cookie'))
  }
  if (apiResponse.headers.get('x-request-id')) {
    res.setHeader('x-request-id', apiResponse.headers.get('x-request-id'))
  }
  res.status(apiResponse.status).json(await apiResponse.json())
}
