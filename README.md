<h1 align="center"><img src="https://verekia.com/_components/images/my-stack/logo.png" alt="My Stack logo" width="100" /><br />My Stack</h1>

<p align="center"><strong>Documented Full-Stack Sample Web App Using My Favorite Tools</strong></p>

<br />

This repository **documents my current favorite stack** and implements it through a **full-featured but minimal demo project** called NotesApp. It's basically a reference and boilerplate for me to use when starting new projects.

The app has different pages, a database, CRUDs, server-side rendering, and authentication. In terms of features, you can write basic private notes, and a note can also be accessible by unauthenticated users if they have its URL (kind of like "unlisted" videos on YouTube).

<!--
Every file of the project is mirrored into a documentation in the `docs` folder. For instance, for `src/pages/_app.tsx`, there is a `docs/src/pages/_app.tsx.md` to comment on specific concepts without bloating the source code with comments. -->

Here is a diagram of the stack:

<br />

![Diagram](https://verekia.com/_components/images/my-stack/stack.png)

In the following section I explain why I chose those specific tools instead of others.

## Table of Contents

- **Core**
  - [Language](#language-typescript): TypeScript
  - [Front-End Library](#front-end-library-react): React
  - [Front-End Server](#front-end-server-nextjs-on-vercel): Next.js on Vercel
- **Back-End**
  - [API Type](#api-type-graphql): GraphQL
  - [CRUD GraphQL API](#crud-graphql-api-hasura-on-heroku): Hasura on Heroku
  - [Custom-Logic GraphQL API](#custom-logic-graphql-api-apollo-on-vercel): Apollo on Vercel
- **Data**
  - [Database](#database-postgresql-on-heroku): PostgreSQL on Heroku
  - [Migrations](#migrations-prisma): Prisma
- **Authentication**
  - [Authentication Provider](#authentication-provider-magic): Magic
  - [Sessions](#sessions-jwt-in-cookies): JWT in Cookies
- **Front-End**
  - [UI Library](#ui-library-material-ui): Material UI
  - [Data Fetching](#data-fetching-react-query): React Query
  - [Client-Only State](#client-only-state-redux): Redux
  - [Forms](#forms-react-hook-form): React Hook Form

<!--
* **Misc**
  * [User Input Validation](#user-input-validation-zod): Zod
-->

<h2 align="center">Core</h2>

<h3>Language: <ins>TypeScript</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/ts.png" alt="TypeScript Logo" width="100" align="left" />

I program in JavaScript over other languages, because I value isomorphic code (using the same code on the client and the server), being able to implement server-side rendering more easily, and programming in only one language in general. Considering that JavaScript is pretty much mandatory for client-side code, there is not much of a choice to make here.

In terms of flavor, I prefer [TypeScript](https://www.typescriptlang.org/) over vanilla ES6, because static typing catches a _lot_ of bugs before they happen. I find TypeScript more reliable than [Flow](https://flow.org/), and it has a much bigger community and support. I would recommend [Python](https://www.python.org/) to someone learning the fundamentals of programming though.

<h3>Front-End Library: <ins>React</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/react.png" alt="React Logo" width="100" align="left" />

I am very satisfied with using [React](https://reactjs.org/) as my front-end library. Its one-way data flow is very intuitive, the ecosystem is rich, server-side rendering is on point, and it is very widely adopted which means there is a lot of support available, as well as work opportunities. The learning curve is a bit steep but you can't go wrong with React.

I know [Vue](https://vuejs.org/) is great, but using it would involve replacing a significant portion of my stack. I would recommend giving it a shot to people who are getting started with front-end development, or need a more lightweight solution than React. [Angular](https://angular.io/) might work for some people, but overall it has a very low developer satisfaction according to the [State of JS 2019](https://2019.stateofjs.com/front-end-frameworks/) (38%, versus 89% for React and 87% for Vue), so I don't think I am missing out much.

<h3>Front-End Server: <ins>Next.js</ins> on <ins>Vercel</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/next-bg.png" alt="Next.js Logo" width="100" align="left" />

Server-Side Rendering (SSR) might be a hard requirement if your website needs to be accessible to programs. Those can be bots from Google for SEO, Facebook for its Open Graph, or Twitter for Cards for instance. If the only pages that need SSR are static pages, such as a landing page, an about page, or articles ("static SSR") you can use [Gatsby](https://www.gatsbyjs.com/), which has a rich plugins ecosystem, particularly for CMSes, and render all the pages at build-time.

If you want to expose pages that are user-generated or dynamic in general (dynamic SSR), you cannot create those pages at build-time, you need a server to render them on the fly. That's where [Next.js](https://nextjs.org/) steps in. Next might not have all the plugins Gatsby has, but it can do both static SSR and dynamic SSR, which makes it a better (and only) choice for this kind of larger project. Just like other Vercel products, it is very elegantly conceived and is a delight to use.

Combining a hybrid static SPA with SSR and with authentication can be quite complicated. I made a [spreadsheet](https://docs.google.com/spreadsheets/d/1oOTVkRzMXskgMCUC09ZtK6C1QQdjBeA2dTvHhiRCifo/edit?usp=sharing) to help figuring out what to do in those different scenarios.

<img src="https://verekia.com/_components/images/my-stack/vercel-bg.png" alt="Vercel Logo" width="100" align="left" />

[Vercel](https://vercel.com/) are the creators of Next and [other great projects](https://github.com/vercel) and a deployment platform for [Jamstack](https://jamstack.org/) apps and serverless functions. Everything from them is honestly top-notch quality. For Next projects in particular, it is the platform of choice. As a deployment platform, the Github integration makes deploying websites a breeze, and their dashboard is stellar. For Jamstack projects, [Netlify](https://www.netlify.com/) is also a good similar alternative. For serverless functions, Vercel supports JavaScript, TypeScript, Go, Python, and Ruby, whereas Netlify only supports JavaScript and Go. Both offer a generous free tier.

<hr />

<h2 align="center">Back-End</h2>

<h3>API Type: <ins>GraphQL</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/graphql.svg" alt="GraphQL Logo" width="100" align="left" />

Compared to REST or RPC, I like that [GraphQL](https://graphql.org/) adds a layer of typechecking at the API-level, lets clients request multiple resources in one query, and gives them the flexibility to request only what they want without having to implement variations on the API-side. It is particularly satisfying to use with Hasura, which automatically exposes a full-featured GraphQL API from your PosgreSQL database without having to write any back-end code.

<h3>CRUD GraphQL API: <ins>Hasura</ins> on <ins>Heroku</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/hasura-bg.png" alt="Hasura Logo" width="100" align="left" />

[Hasura](https://hasura.io/) combines an ORM for CRUD operations via GraphQL on a PostgreSQL database, a DB GUI, DB migrations, roles and permissions, and acts as the single entrypoint for all your API calls, with the ability to call remote GraphQL services under the hood. Its competitor is [PostGraphile](https://www.graphile.org/postgraphile/). I haven't tried it yet, but it looks more complex and is only maintained by a single developer.

<br />
<div>
<img src="https://verekia.com/_components/images/my-stack/heroku.png" alt="Heroku Logo" width="100" align="left" />

[Heroku](http://heroku.com/) has been an excellent PaaS provider for over 10 years. The simplicity of deployments to staging and production via pipelines following the [12-factor](https://12factor.net/) principles ensures smooth releases. The platform has been pretty stagnant over the years though, which is why [Render](https://render.com/) was created. Render is great but doesn't offer a free tier like Heroku does. [AWS](https://aws.amazon.com/elasticbeanstalk/), [Google Cloud Platform](https://cloud.google.com/appengine) and [Microsoft Azure](https://azure.microsoft.com/en-us/services/app-service/) are powerful but too complex for my taste compared to Heroku or Render.

</div>

<h3>Custom-Logic GraphQL API: <ins>Apollo</ins> on <ins>Vercel</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/apollo-bg.png" alt="Apollo Logo" width="100" align="left" />

I use [Apollo Server](https://www.apollographql.com/docs/apollo-server/) hosted on a [Vercel Function](https://vercel.com/docs/serverless-functions/introduction) for custom logic that cannot be handled by Hasura's CRUD. The Hasura server calls the Apollo server via schema stitching. This Apollo server handles authentication and setting cookies as well. It reads and writes data through the Hasura endpoint, so it is both a GraphQL server and client. Since the Hasura server is the only element the Apollo server interacts with, they should be geographically located close to each other.

<hr />

<h2 align="center">Data</h2>

<h3>Database: <ins>PostgreSQL</ins> on <ins>Heroku</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/postgres-circle.png" alt="Prisma Logo" width="100" align="left" />

I think for common use-cases, relational databases are better-suited than NoSQL. Unless you have specific needs, such as very high performance or schema flexibility, a relational database will ensure your data is more consistent than NoSQL databases. Now regarding what system to use, to be honest I am not well-versed enough in databases to argue in favor of [PostgreSQL](https://www.postgresql.org/) over [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). Both [Heroku](http://heroku.com/) and [Render](https://render.com/) only support PostgreSQL, but Heroku's has a free tier.

<h3>Migrations: <ins>Prisma</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/prisma-bg.png" alt="Prisma Logo" width="100" align="left" />

Migrations can be generated by Hasura's UI console as you click around to create tables and columns, but I prefer a more robust and cleaner way to decribe my database schema directly with code. That's why I use [Prisma](https://www.prisma.io/) and its declarative schema, only to take care of migrations. Note that in this architecture, I am not using any [ORM](#data-access-orms), only Hasura's API.

<hr />

<h2 align="center">Authentication</h2>

<h3>Authentication provider: <ins>Magic</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/magic.png" alt="Magic Logo" width="100" align="left" />

I am a fan of passwordless authentication, particularly for bootstrapping projects to production quickly and getting users to sign up with no friction. [Magic](https://magic.link/) is very easy to use, it just opens a popup to tell the user to click on a link in the email that has been sent, and returns a token to confirm the authentication. It has a free tier but it's too expensive at scale. It is also a very recent project, so it could be unstable or disappear. I would use [Auth0](https://auth0.com/) to do the same thing, but they require the user to use the same browser to request the email and validate the email, which will fail for many users, particularly on mobile with email apps using a webview different than the user's regular browser. That's a big no-no to me. I also had bad experiences with Auth0 every time I tried using it, because I find it very complex. An alternative is to implement magic links yourself, which is not very complicated, or using social logins.

**Note**: Auth0 recently released a [Next.js SDK](https://auth0.com/blog/introducing-the-auth0-next-js-sdk/), which seems fairly straightforward and supports both server-side and client-side auth logic. I plan on giving it a shot soon.

<h3>Sessions: <ins>JWT in cookies</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/jwt.svg" alt="JWT Logo" width="100" align="left" />

[JWTs](https://jwt.io/) make it possible to store session data on the client instead of the server (in a Redis for instance), avoiding one database round-trip to validate the identity of the user. They must be stored and transported securely though. The current consensus is to store them in an `HttpOnly`, `Secure`, `SameSite` cookie instead of in `localStorage`.

The JWT authentication mechanism of Hasura requires the JWT to be sent in the `Authorization` header of requests, which is easy to do for server-side requests, but impossible to do for the client since the cookie is inaccessible via JavaScript. This is why I have a [serverless endpoint](/docs/src/pages/api/graphql-client-endpoint.tsx.md#readme) to convert client requests containing a cookie into server requests containing the `Authorization` header. It won't be necessary if Hasura [supports](https://github.com/hasura/graphql-engine/issues/2183) reading JWTs from cookies. Alternatively, you could use `localStorage` at your own risk.

<hr />

<h2 align="center">Front-End</h2>

<h3>UI Library: <ins>Material UI</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/material-ui.png" alt="Material UI Logo" width="100" align="left" />

[Material UI](https://material-ui.com/) is a fantastic battle-tested UI library for React. It provides [Material Design](https://material.io/) components as a starting point but can easily be customized to create specific designs. Some alternatives are [Ant Design](https://ant.design/), [Chakra UI](https://chakra-ui.com/), [Semantic UI](https://react.semantic-ui.com/), or [React Bootstrap](https://react-bootstrap.github.io/), to name a few.

About [Tailwind](https://tailwindcss.com/), and utility classes libraries in general, they are great to build custom interfaces fast but you still have to create components yourself, just like with regular CSS. I have nothing against this kind of library (I even [made my own](https://github.com/verekia/zerocss) back in 2016), but in my opinion, a components library with ready-to-use React components to customize is more productive than recreating everything, particularly because all the required JavaScript is already integrated, and types are directly provided by the components for a great developer experience.

Even if we use a components library, we still need to lay components on the page and position them with custom CSS (`margin`, `position`, `float` kind of things). This could be done with Tailwind, but I feel like it's a bit overkill to add a whole library just for this. Particularly because it adds complexity to the Server-Side Rendering logic, which is complex already. That's why I'd rather just use plain `style` props, or Material UI's own styling solution for that.

<h3>Data fetching: <ins>React Query</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/react-query.svg" alt="React Query Logo" width="100" align="left" />

[React Query](https://react-query.tanstack.com/), [SWR](https://swr.vercel.app/), [Apollo Client](https://www.apollographql.com/docs/react/), and [Urql](https://formidable.com/open-source/urql/) all provide React Hooks to fetch data from an API, and manage it in a memory cache. React Query and SWR bring a whole new semi-real-time paradigm, by optionally polling and re-fetching automatically when the tab is focused. This feature alone can remove the need for websockets in many cases such as a dynamic dashboard. Apollo Client and Urql shine in a GraphQL environment, by offering advanced cache management and GraphQL-specific features, but I've never needed those. Here is a [popularity comparison](https://www.npmtrends.com/react-query-vs-swr-vs-@apollo/client-vs-urql). Apollo is the most popular but [does not offer window focus refetching](https://github.com/apollographql/apollo-feature-requests/issues/247). In my opinion React Query has an edge on SWR by offering the mutation hook.

<h3>Client-only state: <ins>Redux</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/redux-bg.png" alt="Redux Logo" width="100" align="left" />

For data that is not stored on the server, such as client-side-only user preferences (like language or dark mode for instance), I use a state management library. I do not feel strongly about any particular library though. The landscape is pretty wild, with new libraries coming out regularly. The clear default choice is still [Redux](https://redux.js.org/), which can be used in conjunction with [Redux Toolkit](https://redux-toolkit.js.org/) to reduce boilerplate, and [Immer](https://immerjs.github.io/immer/), to make immutability easier to manage. It also has a massive community.

[MobX](https://mobx.js.org/) is the second most popular choice, but I'd rather not use classes to define my state, and I find the observable pattern less clear than Redux. [Zustand](https://zustand.surge.sh/) looks like a great replacement of Redux, but is still quite new. [Recoil](https://recoiljs.org/) is Facebook's new take at managing state with atoms instead of a global object, and I really like that approach, but it's still under development and is probably not a very safe choice at the moment. [Jotai](https://github.com/pmndrs/jotai) is a lightweight alternative to Recoil, and while still very new, this is the library that I am the most interested in at the moment.

<!--
<h3>Forms: <ins>React Hook Form</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/react-hook-form.png" alt="React Hook Form Logo" width="100" align="left" />

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut felis ac urna condimentum consectetur. Sed vitae massa hendrerit, consequat nibh non, aliquet nisi. Nunc sollicitudin facilisis urna ac vestibulum. Sed a arcu posuere, lobortis ipsum vel, varius arcu. Donec purus purus, vehicula vel arcu egestas, volutpat ullamcorper enim. Duis non elit ex. Aenean vestibulum ullamcorper diam at blandit. Nam odio leo, vulputate ac rutrum vel, bibendum id augue.
-->
<hr>
<!--
<h2 align="center">Misc</h2>

<h3>User Input Validation: <ins>Zod</ins></h3>

<img src="https://verekia.com/_components/images/my-stack/zod.svg" alt="Zod Logo" width="100" align="left" />

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut felis ac urna condimentum consectetur. Sed vitae massa hendrerit, consequat nibh non, aliquet nisi. Nunc sollicitudin facilisis urna ac vestibulum. Sed a arcu posuere, lobortis ipsum vel, varius arcu. Donec purus purus, vehicula vel arcu egestas, volutpat ullamcorper enim. Duis non elit ex. Aenean vestibulum ullamcorper diam at blandit. Nam odio leo, vulputate ac rutrum vel, bibendum id augue.

<hr>
-->

<h2 align="center">Extra</h2>

### Data Access (ORMs)

**I am not using an ORM**. I use Hasura directly from the Apollo Server via GraphQL queries. But for reference, this is what I think of the ORM landscape:

For specific custom-logic database calls, you might want an ORM or a query builder to help not write SQL by hand. For this I prefer [Prisma](https://www.prisma.io), which can introspect the database schema and provide amazing TypeScript types specifically tailored to your data. I also really like [Knex](http://knexjs.org/), a simple query builder that can handle migrations too. If you need to modify data during migrations, it will be easier to do with Knex than with Hasura or Prisma's raw SQL.

I tried [TypeORM](https://typeorm.io/) (the "TypeScript" ORM) multiple times, but the fact that some parts of it (such as migrations) cannot interpret TypeScript and rely on compiling your files into JavaScript causes some complicated hybrid TS/JS configuration. It also requires some tweaks with Babel to get decorators to work, which was not as simple as they make it seem. And the connection system has always been a source of headaches to me, particularly in a serverless environment. In comparison, everything worked immediately as expected with Prisma. It is night and day to me but your mileage may vary. I am not considering [Sequelize](https://sequelize.org/) or [Bookshelf](https://bookshelfjs.org/) because they do not support TypeScript.

<!--

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

-->

<hr />

<h2 align="center">About me</h2>

I am Jonathan Verrecchia, aka [@verekia](https://twitter.com/verekia), a French freelance web developer who created [JavaScript Stack from Scratch](https://github.com/verekia/js-stack-from-scratch) and [Initializr](http://www.initializr.com/), and ex-Yelp developer. I love improving my toolset and helping other developers. Here is [my website](https://verekia.com/).
