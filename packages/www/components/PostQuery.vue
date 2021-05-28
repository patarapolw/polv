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
  <b-loading v-else></b-loading>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import axios from 'axios'

import { normalizeArray } from '~/assets/util'
import type { ISearch } from '~/server/db/lunr'

// eslint-disable-next-line no-use-before-define
@Component<PostQuery>({
  mounted() {
    this.updatePosts()
  },
})
export default class PostQuery extends Vue {
  @Prop() defaults?: {
    count: number
    posts: ISearch[]
  }

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
  async updatePosts() {
    const q = this.q || this.cond

    if (q || this.page !== 1 || !this.defaults) {
      const ps = await axios
        .post('/.netlify/functions/search', undefined, {
          params: {
            q,
            page: this.page,
            limit: 5,
          },
        })
        .then((r) => r.data)

      this.count = ps.count
      this.posts = ps.result
    } else {
      this.count = this.defaults.count
      this.posts = this.defaults.posts
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
