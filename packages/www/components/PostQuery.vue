<template>
  <section v-if="isReady">
    <article v-if="posts.length > 0">
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
import type { ISearch } from '~/server/db/lunr'
import { SEARCH } from '~/assets/search'

// eslint-disable-next-line no-use-before-define
@Component<PostQuery>({
  components: {
    PostTeaser,
    Empty,
    Pagination,
  },
  mounted() {
    this.updatePosts()
  },
})
export default class PostQuery extends Vue {
  @Prop() cond?: string

  count = 0
  posts: ISearch[] = []

  isReady = false

  get pageTotal() {
    return Math.ceil(this.count / 5)
  }

  get q() {
    return normalizeArray(this.$route.query.q) || ''
  }

  get page() {
    return parseInt(normalizeArray(this.$route.query.page) || '1')
  }

  @Watch('page')
  @Watch('tag')
  updatePosts() {
    const q = this.q || this.cond

    const rs = SEARCH.search(q)
    this.count = rs.length
    this.posts = rs.slice((this.page - 1) * 5, this.page * 5)

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
