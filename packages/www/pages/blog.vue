<template>
  <section>
    <PostQuery />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'

@Component({
  components: {
    PostQuery,
  },
  watchQuery: ['page', 'q'],
})
export default class BlogPage extends Vue {}
</script>
