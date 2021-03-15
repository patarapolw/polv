import fastify from 'fastify'

import apiRouter from './api'
import { mongooseConnect } from './db/mongo'
import { logger } from './logger'

async function main() {
  await mongooseConnect()

  const app = fastify({ logger })
  const port = parseInt(process.env.SERVER_PORT || '5000')

  app.register(apiRouter, { prefix: '/api' })

  app.listen(port, 'localhost', (err) => {
    if (err) {
      throw err
    }
  })
}

if (require.main === module) {
  main()
}
