import fastify from 'fastify'

import apiRouter from './api'
import { logger } from './logger'

function main() {
  const app = fastify({ logger })
  const port = parseInt(process.env.SERVER_PORT || '5000')

  app.register(apiRouter, { prefix: '/api' })

  app.listen(port, (err) => {
    if (err) {
      throw err
    }
  })
}

if (require.main === module) {
  main()
}
