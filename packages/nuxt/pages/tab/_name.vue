<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'
import { THEME } from '~/assets/global'

@Component({
  components: {
    PostQuery,
  },
  layout: 'blog',
  watchQuery: ['query'],
  async asyncData({ app, params, query }) {
    const tabs = (THEME.tabs || []).reduce(
      (prev, c) => ({
        ...prev,
        [c.id]: c.q,
      }),
      {} as Record<string, string>
    )

    const ps = await app.$axios.$get(`/api/search`, {
      params: {
        q: tabs[params.name],
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
export default class TabPage extends Vue {}
</script>
