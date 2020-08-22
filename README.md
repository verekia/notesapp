# NotesApp

## 2 options for server-side data fetching

### Next SSR pages call the DB / controllers / resolvers directly

```ts
export const getServerSideProps = async () => {
  const notes = await getNotes()
}
```

We still need an API for client-only data fetching. That API would call the same `getNotes` than the example above. `getNotes` (or any controller, or "resolver") must be written in JS/TS to make it possible for our Next server to call them. If the codebase is indeed 100% compatible, this saves 1 network call for SSR renders.

If

### Next SSR pages call the API with a network call

```ts
export const getServerSideProps = async () => {
  const notes = await fetch('/api/notes')
}
```

With this option, the client and Next server  both call `/api/notes` similarly. For SSR, this causes 1 extra network call, but it creates a complete abstraction of what is the "rendering server" and the API. The API can be written in any language with this option. Better separation of front-end and API. Here, Next SSR + the front-end both act as a consumer of the API as a whole. It's one "client", even though it includes SSR.

## Migrations

npx hasura migrate apply --skip-update-check --endpoint XXXX.com --admin-secret XXX && npx hasura metadata apply --skip-update-check --endpoint XXXX.com --admin-secret XXX

On Vercel, migrations have to be done after deployments are complete, not during build, because Hasura will introspect the remote schema that's not deployed yet (or a wrong previous one).

For now I run them by hand after pushing to `dev` or `master`. Maybe a Github Action can streamline the process.

## Generate JWT for auth server

require('jsonwebtoken').sign({'https://hasura.io/jwt/claims':{'x-hasura-allowed-roles':['auth_server'],'x-hasura-default-role': 'auth_server'}}, 'secret-key')

## Random notes

If a client-side only API call hook needs variables in the GraphQL query, use `useMemo:

https://github.com/vercel/swr/issues/93#issuecomment-552072277
