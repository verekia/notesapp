import { FormEvent, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Magic } from 'magic-sdk'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'

import { useRedirectIn } from '../lib/client/hooks'
import { HEADER_NONE } from '../constants'
import { mutate } from 'swr'

const IndexPage = ({ isConfirmedLoggedIn }) => {
  const [loading, setLoading] = useState(false)
  useRedirectIn(isConfirmedLoggedIn)

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const { email: emailEl } = (event.target as any).elements

    try {
      const magic = new Magic(process.env.MAGIC_PUBLIC)
      const didToken = await magic.auth.loginWithMagicLink({ email: emailEl.value })
      const res = await fetch('/api/login', { method: 'POST', body: didToken })
      if (res.status === 200) {
        await mutate('/api/user')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
    setLoading(false)
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 200 }}>
      <Paper style={{ padding: '10px 30px' }}>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            NotesApp
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              size="small"
              name="email"
              placeholder="sven@example.com"
              autoFocus
            />
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ minWidth: 125 }}
            >
              {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Get Started'}
            </Button>
          </form>
          <Link href="/about">
            <Button variant="text" color="primary" style={{ marginTop: 30 }}>About NotesApp</Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}

export const getStaticProps = () => ({ props: { header: HEADER_NONE } })

export default IndexPage
