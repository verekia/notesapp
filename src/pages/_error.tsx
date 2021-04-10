import NextErrorComponent from 'next/error'
import * as Sentry from '@sentry/node'

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err)
  }

  return <NextErrorComponent statusCode={statusCode} />
}

MyError.getInitialProps = async ({ res, err, asPath }) => {
  // @ts-ignore
  const errorInitialProps = await NextErrorComponent.getInitialProps({ res, err })

  // @ts-ignore
  errorInitialProps.hasGetInitialPropsRun = true

  if (res?.statusCode === 404) {
    return { statusCode: 404 }
  }
  if (err) {
    Sentry.captureException(err)
    await Sentry.flush(2000)
    return errorInitialProps
  }

  Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`))
  await Sentry.flush(2000)

  return errorInitialProps
}

export default MyError
