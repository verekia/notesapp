import { gql } from 'graphql-request'

export const GET_ME_QUERY = gql`
  query {
    me: user {
      name
      email
    }
  }
`

export const GET_MY_NOTES_QUERY = gql`
  query {
    myNotes: note(order_by: { updatedAt: desc }) {
      content
      title
      id
      slug
    }
  }
`

export const GET_MY_NOTE_QUERY = gql`
  query($slug: String!) {
    note: note(where: { slug: { _eq: $slug } }) {
      id
      content
      title
    }
  }
`

export const GET_NOTE_PUBLIC_QUERY = gql`
  query($slug: String!) {
    note: note_public(where: { slug: { _eq: $slug } }) {
      content
      title
    }
  }
`

export const CREATE_NOTE_MUTATION = gql`
  mutation($content: String, $slug: String!, $title: String!) {
    insert_note_one(object: { content: $content, slug: $slug, title: $title }) {
      id
    }
  }
`

export const UPDATE_MY_NOTE_MUTATION = gql`
  mutation($content: String, $title: String, $id: uuid!) {
    update_note_by_pk(pk_columns: { id: $id }, _set: { content: $content, title: $title }) {
      id
    }
  }
`

export const DELETE_MY_NOTE_MUTATION = gql`
  mutation($id: uuid!) {
    delete_note_by_pk(id: $id) {
      id
    }
  }
`

export const GET_USER_QUERY = gql`
  query($email: String!) {
    user(where: { email: { _eq: $email } }) {
      id
      name
      email
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation($email: String!) {
    insert_user_one(object: { email: $email }) {
      id
      email
    }
  }
`
