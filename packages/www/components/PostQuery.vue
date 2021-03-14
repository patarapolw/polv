<template>
  <section>
    <header v-if="tag" class="mx-4 mb-4">
      <h1 class="title is-2">Tag: {{ tag }}</h1>
    </header>

    <div v-show="!$fetchState.pending">
      <article v-if="posts.length > 0">
        <div v-for="p in posts" :key="p.path" class="mb-4">
          <PostTeaser :post="p" />
        </div>

        <Pagination v-if="pageTotal > 1" :total="pageTotal" />
      </article>
      <Empty v-else />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

import { normalizeArray } from '@/assets/util'

import Empty from './Empty.vue'
import Pagination from './Pagination.vue'
import PostTeaser from './PostTeaser.vue'
import { api, initAPI } from '~/assets/api'

// eslint-disable-next-line no-use-before-define
@Component<PostQuery>({
  components: {
    PostTeaser,
    Empty,
    Pagination,
  },
  async fetch() {
    await initAPI()
    await this.updatePosts()
  },
})
export default class PostQuery extends Vue {
  @Prop({ default: '' }) cond!: string
  @Prop() tag?: string

  count = 0
  posts: any[] = []

  get pageTotal() {
    return Math.ceil(this.count / 5)
  }

  get q() {
    return this.cond + (normalizeArray(this.$route.query.q) || '')
  }

  get page() {
    return parseInt(normalizeArray(this.$route.query.page) || '1')
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
