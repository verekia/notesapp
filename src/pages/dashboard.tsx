import { useState } from 'react'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from 'next/link'

import { useAPI, useRedirectOut } from '../lib/client/hooks'
import { HEADER_LOGGED_IN } from '../constants'

const DashboardPage = ({ isConfirmedLoggedOut }) => {
  const { data: notes, mutate: mutateNotes } = useAPI('/api/notes')
  useRedirectOut(isConfirmedLoggedOut)

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmitCreate = async (e) => {
    e.preventDefault()
    const title = e.target.elements.title.value
    const content = e.target.elements.content.value
    await fetch('/api/create-note', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    setOpen(false)
    mutateNotes()
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your notes
        </Typography>
      </Box>
      {notes &&
        notes.map((n) => (
          <Box key={n.id}>
            <Link href="/note/[noteId]" as={`/note/${n.id}`}>
              <a>{n.title}</a>
            </Link>{' '}
            - {n.content}
          </Box>
        ))}
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create note
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmitCreate}>
          <DialogTitle id="form-dialog-title">New note</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" id="title" label="Title" fullWidth />
            <TextField margin="dense" id="content" label="Content" fullWidth multiline />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export const getStaticProps = () => ({ props: { header: HEADER_LOGGED_IN }})

// We don't use getServerSideProps because we don't need SEO here

export default DashboardPage
