<template>
  <section>
    <header class="mx-4 mb-4">
      <h1 class="title is-2">Tag: {{ tag }}</h1>
    </header>

    <PostQuery :cond="'tag:' + tag" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostQuery from '@/components/PostQuery.vue'

// eslint-disable-next-line no-use-before-define
@Component<TagPage>({
  components: {
    PostQuery,
  },
  head() {
    return {
      title: `Tag: ${this.tag} - ${this.$accessor.theme.title}`,
    }
  },
  watchQuery: ['page'],
})
export default class TagPage extends Vue {
  tag = this.$route.params.tag
}
</script>
