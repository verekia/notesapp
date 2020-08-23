**[src/pages/dashboard.tsx](/src/pages/dashboard.tsx)**

```tsx
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
import Paper from '@material-ui/core/Paper'
import Link from 'next/link'

import { useRedirectOut, useGraphQL, graphqlFetcher } from '../lib/client/hooks'
import { HEADER_LOGGED_IN } from '../constants'
import { GET_MY_NOTES_QUERY, CREATE_NOTE_WITH_SLUG_MUTATION } from '../lib/client/queries'
import { CircularProgress } from '@material-ui/core'

const DashboardPage = ({ isConfirmedLoggedOut }) => {
  const { data: notesResponse, mutate: mutateNotes } = useGraphQL(GET_MY_NOTES_QUERY)
  const [isCreating, setIsCreating] = useState(false)

  const notes = notesResponse?.myNotes

  useRedirectOut(isConfirmedLoggedOut)

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmitCreate = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    const title = e.target.elements.title.value
    const content = e.target.elements.content.value
    await graphqlFetcher(CREATE_NOTE_WITH_SLUG_MUTATION, { title, content })
    await mutateNotes()
    setOpen(false)
    setIsCreating(false)
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your notes
        </Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create note
        </Button>
      </Box>
      {notes &&
        notes.map((n) => (
          <Paper key={n.id} style={{ padding: 30, marginBottom: 30 }}>
            <Link href="/note/[slug]" as={`/note/${n.slug}`}>
              <a>{n.title}</a>
            </Link>{' '}
            - {n.content}
          </Paper>
        ))}
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
              {isCreating ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export const getStaticProps = () => ({ props: { initialHeader: HEADER_LOGGED_IN } })

export default DashboardPage

```

<!-- nocomment -->

The dashboard should only be accessible to logged-in users, so we redirect unauthenticated ones with a custom hook, `useRedirectOut`.

We use `getStaticProps` to pass some options to the page. Here, the kind of header to use is defined and will be checked in `_app.tsx`.
