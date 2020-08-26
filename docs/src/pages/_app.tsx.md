**[src/pages/_app.tsx](/src/pages/_app.tsx)**

```tsx
import { useEffect } from 'react'

import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'
import getConfig from 'next/config'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useRouter } from 'next/router'
import nprogress from 'nprogress'
import ms from 'ms'

import '../style.css'
import theme from '../theme'
import { HEADER_NONE, HEADER_LOGGED_IN } from '../constants'
import { useUser, graphqlFetcher } from '../lib/client/hooks'
import Header from '../components/Header'
import { REFRESH_TOKEN_MUTATION } from '../lib/client/queries'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig()
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename.replace(distDir, 'app:///_next')
          return frame
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
}

nprogress.configure({ showSpinner: false, minimum: 0.2 })

let progressBarTimeout = null

const clearProgressBarTimeout = () => {
  if (progressBarTimeout) {
    clearTimeout(progressBarTimeout)
    progressBarTimeout = null
  }
}

const startProgressBar = () => {
  clearProgressBarTimeout()
  progressBarTimeout = setTimeout(() => {
    nprogress.start()
  }, 200)
}

const stopProgressBar = () => {
  clearProgressBarTimeout()
  nprogress.done()
}

const App = ({ Component, pageProps, err }) => {
  const router = useRouter()
  const { user, isLoading } = useUser(pageProps.initialUser)

  const isConfirmedLoggedOut = !user && !isLoading
  const isConfirmedLoggedIn = user && !isLoading

  useEffect(() => {
    const firstRefreshTimer = setTimeout(() => graphqlFetcher(REFRESH_TOKEN_MUTATION), ms('1 min'))
    const refreshInterval = setInterval(() => graphqlFetcher(REFRESH_TOKEN_MUTATION), ms('30 min'))
    return () => {
      clearTimeout(firstRefreshTimer)
      clearInterval(refreshInterval)
    }
  }, [])

  useEffect(() => {
    const startProgress = () => startProgressBar()
    const stopProgress = () => stopProgressBar()

    router.events.on('routeChangeStart', startProgress)
    router.events.on('routeChangeComplete', stopProgress)
    router.events.on('routeChangeError', stopProgress)

    return () => {
      router.events.off('routeChangeStart', startProgress)
      router.events.off('routeChangeComplete', stopProgress)
      router.events.off('routeChangeError', stopProgress)
    }
  }, [])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>NotesApp</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {pageProps.initialHeader !== HEADER_NONE && (
          <Header
            loggedInMode={pageProps.initialHeader === HEADER_LOGGED_IN || isConfirmedLoggedIn}
          />
        )}
        <Component
          {...pageProps}
          user={user}
          isConfirmedLoggedOut={isConfirmedLoggedOut}
          isConfirmedLoggedIn={isConfirmedLoggedIn}
          err={err}
        />
      </ThemeProvider>
    </>
  )
}

export default App

```

<!-- nocomment -->

Partially taken from the [with-sentry](https://github.com/vercel/next.js/blob/canary/examples/with-sentry/pages/_app.js) official example.
