import { IncomingMessage as Req } from 'http'

export default async (req: Req, route: string) =>
  (await fetch(`${process.env.API_URL}${route}`, { headers: { cookie: req.headers.cookie } })).json()
