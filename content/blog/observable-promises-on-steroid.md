---
title: Observables are promises on steroids
date: '2020-05-15 00:00 +07:00'
tag:
  - dev.to
  - javascript
  - observable
  - rxjs
---

I am using [observable-fns](https://github.com/andywer/observable-fns) (which can also work with [threads.js](https://threads.js.org/)). Not sure how powerful [RxJS](https://github.com/ReactiveX/rxjs) and [RxJava](https://github.com/ReactiveX/RxJava) can be...

Still missing one important feature though, cancellability.

I am working on SQLite-SQLite and SQLite-MongoDB syncing.

<!-- excerpt_separator -->

```ts
/**
 * DbSqlite needs three basic columns
 *
 * [uid]         TEXT PRIMARY KEY,
 * date_created  DATETIME DEFAULT CURRENT_TIMESTAMP,
 * date_sync     DATETIME,
 */
function replicate (from: DbSqlite, to: DbSqlite, uids?: string[]) {
  return new Observable<{
    message: string
    percent?: number
  }>((obs) => {
    (async () => {
      const getDateSync = (r: any) => Math.max(r.date_created, r.date_sync || 0)

      await to.transaction(() => {
        to.sql.db.parallelize(() => {
          const syncTable = (tableName: string) => {
            from.sql.each(/*sql*/`
            SELECT * FROM ${safeColumnName(tableName)}
            `, (_: any, r1: any) => {
              const uid = r1.uid

              if (uids && !uids.includes(uid)) {
                return
              }

              to.sql.db.get(/*sql*/`
              SELECT date_created, date_sync FROM ${safeColumnName(tableName)} WHERE [uid] = @uid
              `, { uid }, (_: any, r2: any) => {
                const updateSync = () => {
                  r1.date_sync = +new Date()

                  to.sql.db.run(/*sql*/`
                  REPLACE INTO ${safeColumnName(tableName)} (${Object.keys(r1).map(safeColumnName)})
                  VALUES (${Object.keys(r1).map((c) => `@${c}`)})
                  `, r1)
                }

                if (r2) {
                  if (getDateSync(r1) > getDateSync(r2)) {
                    updateSync()
                  }
                } else {
                  updateSync()
                }
              })
            })
          }

          for (const tableName of ['user', 'card', 'quiz', 'lesson', 'deck']) {
            obs.next({
              message: `Uploading table: ${tableName}`
            })
            syncTable(tableName)
          }
        })
      })

      obs.complete()
    })().catch(obs.error)
  })
}
```

If you can curious on what is safe columnName / tableName in SQLite, it is

```yaml link
description: >-
  Not sure about other RDBMS's.           JSON handling   This is possible via
  JSON1 extension. I belie...
icon: >-
  https://res.cloudinary.com/practicaldev/image/fetch/c_scale,fl_progressive,q_auto,w_192/f_auto/https://practicaldev-herokuapp-com.freetls.fastly.net/assets/devlogo-pwa-512.png
image: 'https://dev.to/social_previews/article/326185.png'
keywords:
  - sqlite
  - sql
  - discuss
  - database
  - software
  - coding
  - development
  - engineering
  - inclusive
  - community
title: What SQLite CAN actually do
language: en
type: article
url: 'https://dev.to/patarapolw/what-sqlite-can-actually-do-4co8'
provider: DEV Community
```

Observables can be joined.

```ts
function import (filename: string) {
  return new Observable<{
    message: string
    percent?: number
  }>((obs) => {
    (async () => {
      obs.next({
        message: `Opening: ${filename}`
      })
      const srcDb = await DbSqlite.open(filename)
      DbSqlite.replicate(srcDb, this)
        .subscribe(
          obs.next,
          obs.error,
          obs.complete
        )
    })().catch(obs.error)
  })
}
```

Observables can be polled via WebSockets.

```ts
conn.socket.on('message', async (msg: string) => {
  const { id, filename } = JSON.parse(msg)

  const isNew = !socketMap.has(id)
  socketMap.set(id, (json: any) => {
    conn.socket.send(JSON.stringify(json))
  })

  if (isNew) {
    const observable = db.import(filename)
    logger.info(`Start processing: ${filename}`)

    observable
      .subscribe(
        (status) => {
          socketMap.get(id)!({ id, status })
          logger.info(`Processing status: ${filename}: ${status}`)
        },
        (err) => {
          socketMap.get(id)!({ id, error: err.message })
          logger.error(`Processing error: ${filename}: ${err.message}`)
        },
        () => {
          socketMap.get(id)!({ id, status: 'done' })
          logger.info(`Finished processing: ${filename}`)
        }
      )
  }
})
```

What is remaining is whether Observables can be cancelled via WebSockets?
