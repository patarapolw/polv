<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'
import { api } from '~/assets/api'

// eslint-disable-next-line no-use-before-define
@Component<TabPagePaged>({
  components: {
    PostQuery,
  },
  async asyncData({ app, params }) {
    const tab = app.$accessor.tabs[params.name]

    const ps = await api
      .getEntryList({
        q: tab.q,
        page: parseInt(params.page),
        limit: 5,
      })
      .then((r) => r.data)

    return {
      tab,
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
  head() {
    return {
      title: `${this.tab.name} - ${this.$accessor.theme.title}`,
    }
  },
})
export default class TabPagePaged extends Vue {
  tab!: {
    name: string
  }
}
</script>
