**[next.config.js](/next.config.js)**

```js
const withSourceMaps = require('@zeit/next-source-maps')()

const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  STAGE,
  VERCEL_GITHUB_COMMIT_SHA,
} = process.env

process.env.SENTRY_DSN = SENTRY_DSN
const basePath = ''

module.exports = withSourceMaps({
  serverRuntimeConfig: {
    rootDir: __dirname,
  },
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      VERCEL_GITHUB_COMMIT_SHA &&
      // STAGE !== 'dev'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          stripPrefix: ['webpack://_N_E/'],
          urlPrefix: `~${basePath}/_next`,
          release: VERCEL_GITHUB_COMMIT_SHA,
        })
      )
    }
    return config
  },
  basePath,
  env: {
    MAGIC_PUBLIC: process.env.MAGIC_PUBLIC,
  },
})

```

<!-- nocomment -->

Taken from the official [with-sentry](https://github.com/vercel/next.js/blob/canary/examples/with-sentry/next.config.js) example.
