import { useEffect } from 'react'

import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useRouter } from 'next/router'
import nprogress from 'nprogress'

import '../style.css'
import theme from '../theme'
import { HEADER_NONE, HEADER_LOGGED_IN, HEADER_LOGGED_OUT } from '../constants'
import { useUser } from '../lib/client/hooks'
import Header from '../components/Header'

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

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const { user, isLoading } = useUser(pageProps.initialUser)

  const isConfirmedLoggedOut = !user && !isLoading
  const isConfirmedLoggedIn = user && !isLoading

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
        {pageProps.header !== HEADER_NONE && (
          <Header loggedInMode={pageProps.header === HEADER_LOGGED_IN || isConfirmedLoggedIn} />
        )}
        <Component
          {...pageProps}
          user={user}
          isConfirmedLoggedOut={isConfirmedLoggedOut}
          isConfirmedLoggedIn={isConfirmedLoggedIn}
        />
      </ThemeProvider>
    </>
  )
}

export default App
