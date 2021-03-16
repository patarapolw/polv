import fastify from 'fastify'

import apiRouter from './api'
import { logger } from './logger'

function main() {
  const app = fastify({ logger })
  const port = parseInt(process.env.SERVER_PORT || '5000')

  app.register(apiRouter, { prefix: '/api' })

  // eslint-disable-next-line require-await
  app.delete('/', async () => {
    process.exit(0)
  })

  app.listen(port, (err) => {
    if (err) {
      throw err
    }
  })
}

if (require.main === module) {
  main()
}
