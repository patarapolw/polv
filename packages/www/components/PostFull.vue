<template>
  <section>
    <article class="card mb-4">
      <div class="card-content">
        <PostHeader :post="post" />

        <div v-if="post.image" class="header-image">
          <img
            v-if="typeof post.image === 'string'"
            :src="post.image"
            :alt="post.title"
          />
          <picture v-else>
            <source :srcset="post.image.imWebp" type="image/webp" />
            <source :srcset="post.image.imPng" type="image/png" />
            <img :src="post.image.imPng" :alt="post.title" />
          </picture>
        </div>

        <h1 class="title">{{ post.title }}</h1>

        <div class="content" v-html="post.html" />

        <div style="overflow-wrap: break-word">
          <span class="tw-mr-2">Tags:</span>
          <nuxt-link
            v-for="t in post.tag || []"
            :key="t"
            :to="`/tag/${t}`"
            class="mr-2"
            >{{ t }}</nuxt-link
          >
        </div>
      </div>
    </article>

    <footer class="card my-4 p-2">
      <div ref="comment" />
    </footer>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class PostFull extends Vue {
  @Prop({ required: true }) post!: any

  mounted() {
    const commentEl = this.$refs.comment as HTMLDivElement
    commentEl.textContent = ''

    const src = document.createElement('script')
    src.src = 'https://utteranc.es/client.js'
    src.setAttribute('repo', 'patarapolw/polv')
    src.setAttribute('issue-term', `/post/${this.$route.params.pathMatch}`)
    src.setAttribute('theme', 'github-light')
    src.crossOrigin = 'anonymous'
    src.async = true

    commentEl.append(src)
  }
}
</script>

<style lang="scss" scoped>
.header-image {
  margin-bottom: 1rem;
  margin-left: -1.5rem;
  margin-right: -1.5rem;

  > * {
    width: 100%;
  }
}
</style>
