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
   * Prerendering cannot use 'query'
   */
  async asyncData({ app, params }) {
    const tabs = (this.$accessor.theme.tabs || []).reduce(
      (prev, c) => ({
        ...prev,
        [c.id]: c.q,
      }),
      {} as Record<string, string>
    )

    const ps = await app.$axios.$get(`/api/q`, {
      params: {
        q: tabs[params.name],
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
