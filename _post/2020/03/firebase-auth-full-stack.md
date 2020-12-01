---
title: Firebase auth with both frontend (SPA) and backend
date: 2020-03-28T00:00:00+07:00
tag:
  - auth
  - firebase
  - fullstack
---

auth0-spa-js with express-jwt is not the only way.

Also, firebase offers not only database and authentication, but also analytics and blob storage.

<!-- excerpt_separator -->

## Frontend

```sh
npm i firebase
```

```ts
import firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'

firebase.initializeApp(require('../firebase.config.js'))

let isAuthReady = false

firebase.auth().onAuthStateChanged((user) => {
  store.commit('setUser', user)

  if (!isAuthReady) {
    isAuthReady = true
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app')
  }
})
```

```ts
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { User } from 'firebase/app'
import { SnackbarProgrammatic as Snackbar, LoadingProgrammatic as Loading } from 'buefy'

Vue.use(Vuex)

let loading: {
  close(): any
  requestEnded?: boolean
} | null = null

const store = new Vuex.Store({
  state: {
    user: null as User | null,
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    removeUser (state) {
      state.user = null
    },
  },
  actions: {
    async getApi ({ state }, silent) {
      const api = axios.create()

      if (state.user) {
        api.defaults.headers.Authorization = `Bearer ${await state.user.getIdToken()}`
      }

      if (!silent) {
        api.interceptors.request.use((config) => {
          if (!loading) {
            loading = Loading.open({
              isFullPage: true,
              canCancel: true,
              onCancel: () => {
                if (loading && !loading.requestEnded) {
                  Snackbar.open('API request is loading in background.')
                }
              },
            })
          }

          return config
        })

        api.interceptors.response.use((config) => {
          if (loading) {
            loading.requestEnded = true
            loading.close()
            loading = null
          }

          return config
        }, (err) => {
          if (loading) {
            loading.close()
            loading = null
          }

          Snackbar.open(err.message)
          return err
        })
      }

      return api
    },
  },
})

export default store
```

## Backend

```sh
npm i firebase-admin
```

I use Fastify, but it can easily be framework-agnostic, or even [language-agnostic](https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library).

```ts
import { FastifyInstance } from 'fastify'
import fSession from 'fastify-session'
import fCoookie from 'fastify-cookie'
import admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(require('../../firebase-key.json')),
  databaseURL: 'https://<YOUR_PROJECT_NAME>.firebaseio.com',
})

const router = (f: FastifyInstance, opts: any, next: () => void) => {
  f.register(fCoookie)
  f.register(fSession, { secret: process.env.SECRET! })

  f.addHook('preHandler', async (req, reply, done) => {
    try {
      if (req.req.url && req.req.url.startsWith('/api/doc')) {
        return done()
      }

      const m = /^Bearer (.+)$/.exec(req.headers.authorization || '')

      if (!m) {
        reply.status(401).send()
        return
      }

      const ticket = await admin.auth().verifyIdToken(m[1], true)

      req.session.user = ticket
      if (!db.user) {
        await db.signIn(ticket.email)
      }

      done()
    } catch (e) {
      done(e)
    }
  })

  f.register(apiRouter)
  next()
}

export default router
```

## Conclusion

Firebase, along with a NoSQL (maybe firestore) or SQL, could be a fine choice for web apps with

- Authentication
- Upload
- Database

However, in my eyes, I am not really sure about offline capabilities, even with PWA; unless I resort to Electron.
