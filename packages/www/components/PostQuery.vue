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
import axios from 'axios'

import { normalizeArray } from '@/assets/util'

import Empty from './Empty.vue'
import Pagination from './Pagination.vue'
import PostTeaser from './PostTeaser.vue'

// eslint-disable-next-line no-use-before-define
@Component<PostQuery>({
  components: {
    PostTeaser,
    Empty,
    Pagination,
  },
  async mounted() {
    await this.updatePosts()
  },
})
export default class PostQuery extends Vue {
  @Prop({ required: true }) defaults!: {
    count: number
    posts: any[]
  }

  count = 0
  posts: any[] = []

  isReady = false

  get pageTotal() {
    return Math.ceil(this.count / 5)
  }

  get q() {
    try {
      return normalizeArray(this.$route.query.q) || ''
    } catch (_) {}

    return ''
  }

  get tag() {
    return this.$route.params.tag
  }

  get page() {
    return parseInt(this.$route.params.page || '1')
  }

  @Watch('page')
  @Watch('tag')
  async updatePosts() {
    if (this.q && !this.tag) {
      const ps = await axios
        .post('/.netlify/functions/search', undefined, {
          params: {
            q: this.q,
            page: this.page,
            limit: 5,
          },
        })
        .then((r) => r.data)

      this.count = ps.count
      this.$set(this, 'posts', ps.result)
    } else {
      this.count = this.defaults.count
      this.$set(this, 'posts', this.defaults.posts)
    }

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
