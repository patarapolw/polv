---
title: Layouts in Vue CLI (not Nuxt)
date: '2020-05-20 00:00 +07:00'
category: blog
tag:
  - dev.to
  - vue
  - vue-cli
slug: vue-cli-layouts
---

This can easily be done with Slots and Component `:is`.

```vue
<template lang="pug">
#App
  component(v-if="layout" :is="layout")
    router-view
  router-view(v-else)
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  get layout () {
    const layout = this.$route.meta.layout
    return layout ? `${layout}-layout` : null
  }
}
</script>
```

And it fallbacks to Blank Layout.

<!-- excerpt_separator -->

In `router/index.ts`,

```ts
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const registeredLayouts = [
  'App'
]

registeredLayouts.map((layout) => {
  Vue.component(`${layout}-layout`, () => import(/* webpackChunkName: "[request]-layout" */ `../layouts/${layout}.vue`))
})

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "[request]" */ '../views/Home.vue')
    },
    {
      path: '/example',
      component: () => import(/* webpackChunkName: "[request]" */ '../views/Example.vue'),
      meta: {
        layout: 'App'
      }
    }
  ]
})

export default router
```

And in, `layouts/App.vue`.

```vue
<template lang="pug">
#app
  NavBar
  slot
</template>
```

It is also possible to protect some layouts.

```vue
<template lang="pug">
#App
  b-loading(active v-if="isLoading")
  component(v-else-if="layout" :is="layout")
    router-view
  router-view(v-else)
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  isLoading = true

  get user () {
    return this.$store.state.user
  }

  get layout () {
    const layout = this.$route.meta.layout
    return layout ? `${layout}-layout` : null
  }

  created () {
    this.onUserChange()
  }

  @Watch('user')
  onUserChange () {
    if (!this.user) {
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    } else {
      this.isLoading = false
    }
    this.onLoadingChange()
  }

  @Watch('isLoading')
  onLoadingChange () {
    if (!this.isLoading) {
      if (!this.user) {
        this.$router.push('/')
      } else if (this.$route.path === '/') {
        this.$router.push('/lesson')
      }
    }
  }
}
</script>
```
