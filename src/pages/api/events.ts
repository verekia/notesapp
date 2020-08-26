import logger from 'loglevel'

import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

logger.enableAll()

export default async (req: Req, res: Res) => {
  if (req.headers['event_handler_hasura_secret'] !== process.env.EVENT_HANDLER_HASURA_SECRET) {
    return res.status(403).end()
  }

  const { event, table } = req.body

  logger.info('sometext')

  if (table.name === 'user') {
    if(event.op === 'INSERT') {
      logger.info({ type: 'sign-up', email: event.data.new.email })
    }
  }

  res.status(200).end()
}
