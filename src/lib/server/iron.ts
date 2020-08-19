import Iron from '@hapi/iron'
import { IncomingMessage as Req } from 'http'

import { getTokenCookie } from './auth-cookies'

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET = 'this-is-a-secret-value-with-at-least-32-characters'

export const encryptSession = (session) => Iron.seal(session, TOKEN_SECRET, Iron.defaults)

export const getSession = async (req: Req) => {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
