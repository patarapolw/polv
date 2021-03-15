<template>
  <PostQuery :cond="tab.q" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostQuery from '@/components/PostQuery.vue'

// eslint-disable-next-line no-use-before-define
@Component<TabPage>({
  components: {
    PostQuery,
  },
  watchQuery: ['page'],
  head() {
    return {
      title: `${this.tab.name} - ${this.$accessor.theme.title}`,
    }
  },
})
export default class TabPage extends Vue {
  tab = this.$accessor.tabs[this.$route.params.name]
}
</script>
