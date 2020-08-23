<h1 align="center">🗒️ NotesApp</h1>

NotesApp is a project to **document my current favorite stack**. It is kind of the full-stack equivalent of TodoMVC, but with support for having different pages, a database, CRUDs, server-side rendering, and authentication. It's basically a minimal website with a full-featured architecture to serve as a reference and boilerplate for me when starting a new project.

The app itself is very simple. There is a landing page to sign up and log in, an about page, you can write basic notes for yourself, and single notes can also be accessible by unauthenticated users if they have its URL (kind of like "unlisted" videos on YouTube).

Every file of the project is mirrored into a documentation in the `docs` folder. For instance, for `src/pages/_app.tsx`, there is a `docs/src/pages/_app.tsx.md` to comment on specific concepts without bloating the source code with comments.

Here is a diagram of the stack and tools used:

<br />

![Diagram](/docs/img/stack.png)

<br />

In the following section I explain why I chose those specific tools instead of others.

## Language and ecosystem: TypeScript

<img src="/docs/img/ts.png" alt="TypeScript Logo" width="100">

I program in JavaScript / TypeScript over other languages, because I value isomorphic code (using the same code on the client and the server), being able to implement server-side rendering more easily, and programming in only one language in general. Considering that JavaScript is pretty much mandatory for client-side code, there is not much of a choice to make here.

In terms of flavor, I prefer TypeScipt over vanilla ES6, because static typing catches a _lot_ of bugs before they happen. I find TypeScript more reliable than Flow, and it has a much bigger community and support.

I would recommend Python to someone learning the fundamentals of programming though.

## Front-End Library: React

<img src="/docs/img/react.png" alt="React Logo" width="100">

I am very satisfied with using [React](https://reactjs.org/) as my front-end library. Its one-way data flow is very intuitive, the ecosystem is rich, server-side rendering is on point, and it is very widely adopted which means there is a lot of support available, as well as work opportunities.

I know [Vue](https://vuejs.org/) is great, but I haven't tried it yet, because it would involve replacing a significant portion of my stack if I were to replace React by it. I would recommend giving it a shot to people who are just getting started with front-end development, or need a lightweight solution though.

[Angular](https://angular.io/) might work for some people, but overall it has a very low developer satisfaction according to the [State of JS 2019](https://2019.stateofjs.com/front-end-frameworks/) (38%, versus 89% for React and 87% for Vue), so I don't think I am missing out much.

## Server-Side Rendering: Next.js

<img src="/docs/img/next.png" alt="Next.js Logo" width="150">

Server-Side Rendering (SSR) might be a hard requirement if your website needs to be accessible to programs. Those can be bots from Google for SEO, Facebook for its Open Graph, or Twitter for Cards for instance. If the only pages that need SSR are static pages, such as a landing page, an about page, or articles ("static SSR") you can use Gatsby, which has a rich plugins ecosystem, particularly for CMSes, and render all the pages at build-time. If you want to expose pages that are user-generated or dynamic in general (dynamic SSR), you cannot create those pages at build-time, you need a server to render them on the fly. That's where [Next.js](https://nextjs.org/) steps in. Next might not have all the plugins Gatsby has, but it can do both static SSR and dynamic SSR, which makes it a better (and only) choice for this kind of larger project. Just like other Vercel products, it is very elegantly conceived and is a delight to use.

## Deployment platform: Vercel

<img src="/docs/img/vercel.png" alt="Vercel Logo" width="150">

[Vercel](https://vercel.com/) are the creators of Next and [other great projects](https://github.com/vercel) and a deployment platform for [Jamstack](https://jamstack.org/) apps and serverless functions. Everything from them is honestly top-notch quality and well-crafted. As a deployment platform, the Github integration makes deploying websites a breeze, and their dashboard is stellar. For Next projects in particular, it is the platform of choice. For Jamstack projects, Netlify is also a good similar alternative. For serverless functions, Vercel supports JavaScript, TypeScript, Go, Python, and Ruby, whereas Netlify only supports JavaScript and Go.

Both Vercel and Netlify offer a ridiculously generous free tier.

## GraphQL Engine: Hasura on Heroku

<img src="/docs/img/hasura.svg" alt="Hasura Logo" width="100">

Hasura combines an ORM for CRUD operations via GraphQL on a PostgreSQL database, a DB GUI, DB migrations, roles and permissions, and acts as the single entrypoint for all your API calls, with the ability to call remote GraphQL services under the hood. Its competitor is [PostGraphile](https://www.graphile.org/postgraphile/) which I haven't tried yet.

## GraphQL Server: Apollo Server on Vercel Serverless

Apollo Logo

I use Apollo Server for custom logic that cannot be handled by Hasura's CRUDs. The only consumer of this server is the Hasura server, which can seemlessly make calls to the Apollo Server and return results to the user.

I use Vercel's serverless functions to host the Apollo Server.

## Authentication method: Passwordless with Magic

I am a fan of passwordless authentication, particularly for bootstrapping projects to production quickly and getting users to sign up with no friction. Magic is very easy to use, it just opens a popup to tell the user to click on a link in the email that has been sent, and returns a token to confirm the authentication. It has a free tier but it's too expensive at scale. It is also a very recent project, so it could be unstable or disappear. I would use Auth0 to do the same thing, but they require the user to use the same browser to request the email and validate the email, which will fail for many users, particularly on mobile with email apps using a webview different than the user's regular browser. That's a big no-no to me. An alternative is to implement magic links yourself, which is not very complicated, or using social logins.

## Sessions: JWT in cookies

JWTs make it possible to store session data on the client instead of the server (in a Redis for instance), avoiding one database round-trip to validate the identity of the user. They must be stored and transported securely though. The current consensus is to store them in an HttpOnly, Secure, SameSite cookie.

The JWT authentication mechanism of Hasura requires the JWT to be sent in the `Authorization` header of requests, which is easy to do for server-side requests, but impossible to do for the client since the cookie is inaccessible via JavaScript. This is why I have a serverless endpoint to convert client requests containing a cookie into server requests containing the `Authorization` header. It won't be necessary if Hasura [supports](https://github.com/hasura/graphql-engine/issues/2183) reading JWTs from cookies.

## ORM: Prisma

Prisma Logo

Most operations will be done directly via Hasura's CRUDs, but for specific custom-logic database calls, you might want an ORM or a query builder to help not write SQL by hand. ...(even though Prisma says it's technically [not an ORM](https://www.prisma.io/docs/understand-prisma/prisma-in-your-stack/is-prisma-an-orm))

Prisma vs TypeORM, Knex. Sequelize, Bookshelf.

## DatabaseL PostgreSQL

PostgreSQL Logo

I think for common use-cases, relational databases are better-suited than NoSQL. Unless you have specific needs, such as very high performance, a relational database will ensure your data is consistent more than NoSQL databases. Now regarding what system to use, to be honest I am not well-versed enough in databases to argue in favor of PostgreSQL over MySQL or MariaDB. I'm just using Postgres because it's the default and only option Heroku offers, and I trust Heroku to make the right choice for me. Hasura also only supports Postgres currently.

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

## About me

I am Jonathan Verrecchia, aka [@verekia](https://twitter.com/verekia), a French freelance web developer who created JavaScript Stack From Scratch and Initializr, and ex-Yelp developer. I love improving my toolset and helping other developers. I am open to developer relations jobs or remote freelance work. My [resume](https://verekia.com/resume/) is available on my [website](https://verekia.com/).
