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
  async asyncData({ app, params }) {
    const PORT = process.client ? 3000 : 5000
    const ps = await app.$axios.$get(
      `http://localhost:${PORT}/serverMiddleware/search`,
      {
        params: {
          offset: (parseInt(params.page) - 1) * 5,
        },
      }
    )

    return {
      defaults: {
        count: ps!.count,
        posts: ps!.result,
      },
    }
  },
})
export default class BlogPaged extends Vue {}
</script>
