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
  /**
   * Server-side asyncData doesn't have access to query (i.e. empty object)
   */
  async asyncData({ app, params }) {
    const ps = await app.$axios.$get('/api/q', {
      params: {
        page: params.page,
      },
    })

    return {
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
})
export default class BlogPagePaged extends Vue {}
</script>
