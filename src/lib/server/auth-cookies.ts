import { serialize, parse } from 'cookie'
import { NextApiResponse as Res } from 'next'
import { IncomingMessage as Req } from 'http'

const TOKEN_NAME = 'notesapptoken'
const MAX_AGE = 60 * 60 * 8 // 8 hours

const parseCookies = (req: Req) => parse(req.headers?.cookie ?? '')

export const setTokenCookie = (req: Req, res: Res, token: string) =>
  res.setHeader(
    'Set-Cookie',
    serialize(TOKEN_NAME, token, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: process.env.STAGE !== 'dev',
      path: '/',
      sameSite: 'lax',
    })
  )

export const removeTokenCookie = (res: Res) =>
  res.setHeader('Set-Cookie', serialize(TOKEN_NAME, '', { maxAge: -1, path: '/' }))

export const getTokenCookie = (req: Req) => parseCookies(req)[TOKEN_NAME]
