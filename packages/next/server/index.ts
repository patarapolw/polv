import fastify from 'fastify'
import mongoose from 'mongoose'

import apiRouter from './api'
import { logger } from './logger'

async function main() {
  await mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  const app = fastify({ logger })
  const port = parseInt(process.env.SERVER_PORT || '17338')

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
