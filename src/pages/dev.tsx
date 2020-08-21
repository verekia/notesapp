import { request, gql } from 'graphql-request'
import Container from '@material-ui/core/Container'
import useSWR from 'swr'

const GET_NOTE_QUERY = gql`
  query($id: String!) {
    note_by_pk(id: $id) {
      id
      title
      content
    }
  }
`

const DevPage = () => {
  const id = 'Vo9BzEqgqxhTW79ESbt2'
  const { data } = useSWR([GET_NOTE_QUERY, id], (query, id) =>
    request('/api/client-adapter', query, { id })
  )

  return <Container>{data ? <div>{JSON.stringify(data)}</div> : 'Loading'}</Container>
}

export default DevPage
