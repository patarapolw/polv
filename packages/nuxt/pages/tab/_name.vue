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
  watchQuery: ['query'],
  async asyncData({ app, params, query }) {
    const ps = (await app.$axios.$get(`/api/search`, {
      params: {
        q: tabs[params.name],
        page: query.page,
      },
    }))!

    return {
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
})
export default class TabPage extends Vue {}
</script>
