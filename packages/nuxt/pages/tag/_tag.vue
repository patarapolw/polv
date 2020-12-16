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
  watchQuery: ['page'],
  async asyncData({ app, params, query }) {
    const ps = await app.$axios.$get('/api/search', {
      params: {
        tag: params.tag,
        page: query.page,
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
export default class TagPage extends Vue {}
</script>
