<template>
  <PostQuery />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostQuery from '@/components/PostQuery.vue'

@Component({
  components: {
    PostQuery,
  },
  head() {
    return {
      title: `Tag: ${this.$route.params.tag}`,
    }
  },
})
export default class TagPage extends Vue {}
</script>
