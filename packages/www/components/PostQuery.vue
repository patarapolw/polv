<template>
  <section>
    <header v-if="tag" class="mx-4 mb-4">
      <h1 class="title is-2">Tag: {{ tag }}</h1>
    </header>

    <article v-if="!isReady || posts.length > 0">
      <div v-for="p in posts" :key="p.path" class="mb-4">
        <PostTeaser :post="p" />
      </div>

      <Pagination v-if="pageTotal > 1" :total="pageTotal" />
    </article>
    <Empty v-else />
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

import { normalizeArray } from '@/assets/util'

import Empty from './Empty.vue'
import Pagination from './Pagination.vue'
import PostTeaser from './PostTeaser.vue'
import { api, initAPI } from '~/assets/api'

@Component({
  components: {
    PostTeaser,
    Empty,
    Pagination,
  },
})
export default class PostQuery extends Vue {
  @Prop({ default: '' }) cond!: string

  count = 0
  posts: any[] = []

  isReady = false

  get pageTotal() {
    return Math.ceil(this.count / 5)
  }

  get q() {
    return this.cond + (normalizeArray(this.$route.query.q) || '')
  }

  get tag() {
    return this.$route.params.tag
  }

  get page() {
    return parseInt(normalizeArray(this.$route.query.page) || '1')
  }

  async mounted() {
    await initAPI()
    this.updatePosts()
  }

  @Watch('page')
  @Watch('tag')
  async updatePosts() {
    let q = this.q
    if (this.tag) {
      q += ` tag:${this.tag}`
    }

    const r = await api.getEntryList({
      q,
      page: this.page,
      limit: 5,
    })

    this.count = r.data.count
    this.posts = r.data.result

    this.isReady = true
  }

  @Watch('q')
  onQChanged() {
    const { q } = this.$route.query

    this.$router.push({
      path: '/blog',
      query: { q },
    })

    this.updatePosts()
  }
}
</script>
