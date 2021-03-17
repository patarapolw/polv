<template>
  <section>
    <PostQuery />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  watchQuery: ['page', 'q'],
})
export default class BlogPage extends Vue {}
</script>
