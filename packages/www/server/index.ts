import fastify from 'fastify'

import apiRouter from './api'

function main() {
  const app = fastify({
    logger: true
  })
  const port = parseInt(process.env.npm_package_config_serverPort || '5000')

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
