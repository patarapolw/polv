import fastify from 'fastify'

import apiRouter from './api'
import { mongooseConnect } from './db/mongo'
import { logger } from './logger'

async function main() {
  await mongooseConnect()

  const app = fastify({ logger })
  const port = parseInt(process.env.SERVER_PORT || process.env.PORT || '5000')

  app.register(apiRouter, { prefix: '/api' })

  app.listen(
    port,
    process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
    (err) => {
      if (err) {
        throw err
      }
    }
  )
}

if (require.main === module) {
  main()
}
