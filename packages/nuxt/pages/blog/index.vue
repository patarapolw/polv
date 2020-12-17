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
  /**
   * Server-side asyncData doesn't have access to query (i.e. empty object)
   */
  async asyncData({ app }) {
    const ps = await app.$axios.$get('/api/q')

    return {
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
})
export default class BlogPage extends Vue {}
</script>
