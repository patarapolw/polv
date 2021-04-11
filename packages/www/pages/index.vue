<template>
  <section>
    <PostQuery :defaults="defaults" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { api, initAPI } from '~/assets/api'

@Component({
  watchQuery: ['page'],
  async asyncData() {
    await initAPI()
    const { data } = await api.getEntryList()

    return {
      defaults: {
        posts: data.result,
        count: data.count,
      },
    }
  },
})
export default class IndexPage extends Vue {}
</script>
