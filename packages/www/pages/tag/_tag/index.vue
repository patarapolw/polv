<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'
import { api } from '~/assets/api'

// eslint-disable-next-line no-use-before-define
@Component<TagPage>({
  components: {
    PostQuery,
  },
  async asyncData({ params }) {
    const ps = await api
      .getEntryList({
        q: 'tag:' + params.tag,
        page: 1,
        limit: 5,
      })
      .then((r) => r.data)

    return {
      defaults: {
        count: ps.count,
        posts: ps.result,
      },
    }
  },
  head() {
    return {
      title: `Tag:${this.$route.params.tag} - ${this.$accessor.theme.title}`,
    }
  },
})
export default class TagPage extends Vue {}
</script>
