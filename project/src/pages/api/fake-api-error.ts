import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

export default async (_: Req, res: Res) => {
  // @ts-ignore
  fakeUndefinedFunction()
  res.status(200).end()
}
