<template>
  <PostQuery :tag="tag" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostQuery from '@/components/PostQuery.vue'

// eslint-disable-next-line no-use-before-define
@Component<TagPage>({
  components: {
    PostQuery,
  },
  watchQuery: ['page'],
  head() {
    return {
      title: `Tag: ${this.tag} - ${this.$accessor.theme.title}`,
    }
  },
})
export default class TagPage extends Vue {
  tag = this.$route.params.tag
}
</script>
