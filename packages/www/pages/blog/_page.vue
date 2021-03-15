<template>
  <PostQuery :defaults="defaults" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'
import { api, initAPI } from '~/assets/api'

@Component({
  components: {
    PostQuery,
  },
  async asyncData({ params }) {
    await initAPI()
    const ps = await api
      .getEntryList({
        page: parseInt(params.page),
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
})
export default class BlogPagePaged extends Vue {}
</script>
