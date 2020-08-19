import React from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import Link from 'next/link'
import LogoIcon from '@material-ui/icons/ImportContacts'
import Button from '@material-ui/core/Button'

export interface HeaderProps {
  loggedInMode: boolean
  user?: { email: string }
}

const HideOnScroll = (props) => {
  const { children, window } = props
  // This is to support being in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    logoIcon: { marginRight: theme.spacing(2) },
    title: { flexGrow: 1, '& a': { color: 'white', textDecoration: 'none' } },
    ctaButton: { color: theme.palette.primary.main, background: 'white' },
  })
)

const Header = (props: HeaderProps) => {
  const { loggedInMode } = props
  const classes = useStyles()

  return (
    <>
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <LogoIcon className={classes.logoIcon} />

            <Typography variant="h6" className={classes.title}>
              <Link href="/">
                <a>NotesApp</a>
              </Link>
            </Typography>

            {loggedInMode ? (
              <Button color="inherit" href="/api/logout">
                Log Out
              </Button>
            ) : (
              <Link href="/">
                <Button className={classes.ctaButton} variant="contained">
                  Sign In
                </Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  )
}

export default Header
