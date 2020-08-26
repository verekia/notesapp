**[src/pages/api/graphql-client-endpoint.tsx](/src/pages/api/graphql-client-endpoint.tsx)**

```tsx
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

```

<!-- nocomment -->

This endpoint is only used to transform client requests (which have their JWT token in an `HttpOnly` cookie) into requests with the `Authorization` header. It's basically forwarding the request to the Hasura endpoint. It's also convenient if you host your API on a different domain than your rendering server to be able to set cookies on the domain of the rendering server. But ideally you would have both under the same domain, and would be able to get rid of this endpoint completely if Hasura implements [reading JWTs from cookies](https://github.com/hasura/graphql-engine/issues/2183).
