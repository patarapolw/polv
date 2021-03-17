<template>
  <section>
    <PostQuery />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  watchQuery: ['page'],
})
export default class IndexPage extends Vue {}
</script>
