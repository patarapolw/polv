<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'

@Component({
  components: {
    PostQuery,
  },
  layout: 'blog',
  async asyncData({ app }) {
    const PORT = process.client ? 3000 : 5000
    const ps = await app.$axios.$get(
      `http://localhost:${PORT}/serverMiddleware/search`
    )

    return {
      defaults: {
        count: ps!.count,
        posts: ps!.result,
      },
    }
  },
})
export default class Blog extends Vue {}
</script>
