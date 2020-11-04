/* eslint-disable no-console */
import http from 'http'

import express, { Router } from 'express'
import cors from 'cors'

import postRouter from './post'
import searchRouter from './search'

const PORT = 5000
const app = express()

app.use(cors())

const router = Router()
app.use('/serverMiddleware', router)

router.get('/post', postRouter)
router.get('/search', searchRouter)

const runServer = () =>
  new Promise<http.Server | undefined>((resolve) => {
    const srv = app
      .listen(PORT, () => {
        console.info(`serverMiddleware is running on http://localhost:${PORT}`)
        resolve(srv)
      })
      .once('error', () => {
        // console.error('serverMiddleware has an error')
        resolve()
      })
      .once('close', () => {
        console.info('serverMiddleware is closing')
      })
  })

export default runServer

if (require.main === module) {
  runServer().catch(console.error)
}
