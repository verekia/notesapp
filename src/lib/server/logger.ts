import LogDNA from 'logdna'

const logger = LogDNA.createLogger(process.env.LOGDNA_KEY, {
  app: 'NotesApp',
  env: process.env.STAGE,
})

const createMsg = (consoleFn: Function, type: string, payload?: any) => {
  if (payload?.type) {
    throw Error('Logging Error: The log payload cannot have a type field')
  }
  const str = JSON.stringify({ type, ...(payload ?? {}) })
  // if (process.env.STAGE === 'dev') {
  consoleFn(str)
  // }
  return str
}

export const info = (type: string, payload?: Object) =>
  logger.info(createMsg(console.info, type, payload))

export const warn = (type: string, payload?: Object) =>
  logger.warn(createMsg(console.warn, type, payload))

export const debug = (type: string, payload?: Object) =>
  logger.debug(createMsg(console.debug, type, payload))

export const error = (type: string, payload?: Object) =>
  logger.error(createMsg(console.error, type, payload))

export const fatal = (type: string, payload?: Object) =>
  logger.fatal(createMsg(console.error, type, payload))
