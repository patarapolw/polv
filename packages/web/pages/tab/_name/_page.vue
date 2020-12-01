<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'

const tabs: Record<string, string> = JSON.parse(process.env.tabs!)

@Component({
  components: {
    PostQuery,
  },
  layout: 'blog',
  async asyncData({ app, params }) {
    const PORT = process.client ? 3000 : 5000
    const ps = (await app.$axios.$get(
      `http://localhost:${PORT}/serverMiddleware/search`,
      {
        params: {
          q: tabs[params.name],
          offset: (parseInt(params.page) - 1) * 5,
        },
      }
    ))!

    return {
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
})
export default class TagPaged extends Vue {}
</script>
