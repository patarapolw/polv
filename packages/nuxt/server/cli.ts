import http from 'http'

import express from 'express'

import { router } from '.'

const app = express()
app.use('/api', router)

export const SERVER_PORT = 5000

export const runServer = () =>
  new Promise<http.Server | Error>((resolve) => {
    const srv = app
      .listen(SERVER_PORT, () => {
        // eslint-disable-next-line no-console
        console.info(
          `serverMiddleware is running at http://localhost:${SERVER_PORT}`
        )
        resolve(srv)
      })
      .once('error', (e) => {
        /**
         * Nuxt generate will try to spawn two process on the same SERVER_PORT.
         *
         * One of which will inevitably fail.
         *
         * ! DO NOT reject()
         */
        resolve(e)
      })
      .once('close', () => {
        // eslint-disable-next-line no-console
        console.info('serverMiddleware is closing')
      })
  })

if (require.main === module) {
  // eslint-disable-next-line no-console
  runServer().catch(console.error)
}
