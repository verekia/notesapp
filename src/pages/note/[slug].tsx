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
import { GetServerSideProps } from 'next'
import { mutate } from 'swr'
import { useRouter } from 'next/router'

import { useGraphQL, graphqlFetcher } from '../../lib/client/hooks'
import { HEADER_LOGGED_IN, HEADER_LOGGED_OUT } from '../../constants'
import { ssrApiCall } from '../../lib/server/api-call'
import {
  GET_NOTE_PUBLIC_QUERY,
  GET_MY_NOTE_QUERY,
  GET_MY_NOTES_QUERY,
  DELETE_MY_NOTE_MUTATION,
  UPDATE_MY_NOTE_MUTATION,
} from '../../lib/client/queries'
import { getTokenCookie } from '../../lib/server/auth-cookies'

const NotePage = ({ user, initialData, initialGraphqlOptions }) => {
  const initialNote = initialData?.note[0]

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [titleEdit, setTitleEdit] = useState(initialNote.title)
  const [contentEdit, setContentEdit] = useState(initialNote.content)

  const router = useRouter()

  const { data: noteResponse, mutate: mutateNote } = useGraphQL(
    initialGraphqlOptions.query,
    initialGraphqlOptions.variables,
    {
      redirectIfLoggedOut: false,
      initialData: initialData,
      onSuccess: (data) => {
        setTitleEdit(data?.note[0]?.title)
        setContentEdit(data?.note[0]?.content)
      },
    }
  )
  const note = noteResponse?.note[0]

  const handleClickEditOpen = () => {
    setEditOpen(true)
  }

  const handleEditClose = () => {
    setEditOpen(false)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    const title = e.target.elements.title.value
    const content = e.target.elements.content.value
    await graphqlFetcher(UPDATE_MY_NOTE_MUTATION, { id: note.id, title, content })
    await mutateNote()
    await mutate(GET_MY_NOTES_QUERY, null, true)
    setEditOpen(false)
  }

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
  }

  const handleSubmitDelete = async () => {
    await graphqlFetcher(DELETE_MY_NOTE_MUTATION, { id: note.id })
    await mutate(GET_MY_NOTES_QUERY, null, true)
    router.push('/dashboard')
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {note.title}
        </Typography>
        <Box>{note.content}</Box>
      </Box>
      {user && (
        <>
          <Button variant="outlined" color="primary" onClick={handleClickEditOpen}>
            Edit
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClickDeleteOpen}>
            Delete
          </Button>
          <Dialog
            open={editOpen}
            aria-labelledby="form-dialog-title"
            onBackdropClick={handleEditClose}
          >
            <form onSubmit={handleSubmitEdit}>
              <DialogTitle id="form-dialog-title">Edit note</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Title"
                  fullWidth
                  value={titleEdit}
                  onChange={(e) => setTitleEdit(e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="content"
                  label="Content"
                  fullWidth
                  multiline
                  value={contentEdit}
                  onChange={(e) => setContentEdit(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose} color="primary">
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Dialog
            open={deleteOpen}
            onClose={handleDeleteClose}
            onBackdropClick={handleDeleteClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Delete note</DialogTitle>
            <DialogActions>
              <Button onClick={handleDeleteClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitDelete} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  )
}

// We use getServerSideProps because we want to expose the notes publicly for SEO
// This is used by Next's native client-side navigation via AJAX call, and during
// server-only navigation. It is not used by SWR.
//
// This page is hybrid, we show to right header depending on whether the user is
// logged in or not. We also don't redirect in the client-side hooks.
export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const token = getTokenCookie(req)

  const graphqlOptions = {
    query: token ? GET_MY_NOTE_QUERY : GET_NOTE_PUBLIC_QUERY,
    variables: { slug: params.slug },
  }

  const { data } = await ssrApiCall(graphqlOptions, token)

  return {
    props: {
      initialGraphqlOptions: graphqlOptions,
      initialData: data,
      initialHeader: token ? HEADER_LOGGED_IN : HEADER_LOGGED_OUT,
    },
  }
}

export default NotePage
