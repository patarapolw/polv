<template>
  <section>
    <header class="mx-4 mb-4">
      <h1 class="title is-2">{{ entry.name }}</h1>
    </header>

    <PostQuery :cond="entry.q" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<TabPage>({
  head() {
    return {
      title: `${this.entry.name} - ${this.$accessor.theme.title}`,
    }
  },
  watchQuery: ['page'],
})
export default class TabPage extends Vue {
  tabName = this.$route.params.tabName

  get entry() {
    return this.$accessor.tabs[this.tabName]
  }
}
</script>
