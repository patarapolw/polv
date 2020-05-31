---
title: TypeScript with worker_threads and hot reload
date: '2020-05-13 00:00 +07:00'
tag:
  - dev.to
  - node.js
  - typescript
  - worker_threads
---

One of the way is indeed using [threads.js](https://threads.js.org/) (and [observable-fns](https://github.com/andywer/observable-fns)), but I came with a Native way (for Node 10+ latest with CLI --experimental option and Node 12+).

That is using [tsc-watch](https://github.com/gilamran/tsc-watch) instead of ts-node-dev.

<!-- excerpt_separator -->

```ts
// Main thread
import { Worker } from 'worker_threads'

// eslint-disable-next-line func-call-spacing
const socketMap = new Map<string, (msg: any) => void>()

// Inside Websocket function
  conn.socket.on('message', (msg: string) => {
      const { id, type, filename } = JSON.parse(msg)

      const isNew = !socketMap.has(id)
      socketMap.set(id, (json: any) => {
        conn.socket.send(JSON.stringify(json))
      })

      if (isNew) {
        const spawn = () => {
          const worker = new Worker(path.join(__dirname, '../worker/process-upload.js'))

          worker
            .on('online', () => {
              worker.postMessage({ id, type, filename })
            })
            .on('message', (status = 'done') => {
            socketMap.get(id)!({ id, status })
            })
            .on('error', (err) => {
              console.error(`Error: ${filename}, ${err.message}`)
            })
            .on('exit', (code) => {
              if (code === 0) {
                console.log(`Worker: ${filename} exited with code ${code}`)
                socketMap.get(id)!({ id, status: 'done' })
              } else {
                console.log(`Worker: ${filename} exited with code ${code}`)
              }
            })
        }

        spawn()
      }
    })
```

```ts
// Worker thread

import { parentPort } from 'worker_threads'

const parent = parentPort!

const postMessage = (msg: string) => parent.postMessage(msg)

parent.on('message', ({ id, type, filename }) => {
  // Some better-sqlite3 write and AdmZip sync stuff.

  process.exit(0)
})
```

```yaml link
description: >-
  Repeat until recall. Aims to be more powerful Anki alternative. -
  patarapolw/rep2recall
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
title: patarapolw/rep2recall
language: en
type: object
url: >-
  https://github.com/patarapolw/rep2recall/blob/master/packages/e-server/src/router/file.ts
provider: GitHub
```

But for some reasons,

- sometimes Worker thread exits with Code 1 (possibly some kind of default termination), and I cannot use `on('exit')` directly without checking exit code...
  - If I use threads.js, error throws clearly (inside Observable) that it is due to database write lock; and `console.log` works properly.
  - worker.on('exit') is called with code 1, but the worker thread does not seem to stop (there is still writes to the SQLite).
- `console.log` not really working in Worker threads.
