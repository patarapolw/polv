<template>
  <section class="card">
    <article class="card-content">
      <PostHeader :post="post" />

      <div class="post-content">
        <div v-if="post.image" class="image-teaser">
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

        <nuxt-link :to="url">
          <h2 class="title mb-4 header-link">{{ post.title }}</h2>
        </nuxt-link>

        <div class="content" v-html="post.excerptHtml" />
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import PostHeader from './PostHeader.vue'

@Component({
  components: {
    PostHeader,
  },
})
export default class PostTeaser extends Vue {
  @Prop({ required: true }) post!: any

  get url() {
    const h = this.post
    return `/post/${h.path}`
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  margin: 0;
  max-width: 80vw;
}

.header-link:hover {
  color: rgb(0, 160, 255);
}

.image-teaser {
  width: calc(100% + 3rem);
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: -1.5rem;
  margin-right: -1.5rem;

  > * {
    width: 100%;
  }

  @media only screen and (min-width: 800px) {
    max-width: 300px;
    max-height: 300px;
    float: right;
    margin-left: 1rem;
    margin-right: 0;
    margin-top: 0;
  }
}

.post-content {
  width: 100%;
  overflow: visible;
}
</style>
