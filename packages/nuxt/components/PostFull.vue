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

        <div class="content" v-html="post.contentHtml" />

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

    <footer v-if="remark42Config" class="card my-4">
      <div class="card-content">
        <div ref="remark42" />
      </div>
    </footer>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import hljs from 'highlight.js'

import '~/assets/remark42'

import PostHeader from './PostHeader.vue'
import { THEME } from '~/assets/global'

@Component({
  components: {
    PostHeader,
  },
})
export default class PostFull extends Vue {
  @Prop({ required: true }) post!: any

  remark42Config = THEME.comment?.remark42 || null
  remark42Instance: any = null

  mounted() {
    if (window.REMARK42) {
      this.initRemark42()
    } else {
      window.addEventListener('REMARK42::ready', () => {
        this.initRemark42()
      })
    }

    this.$el.querySelectorAll('pre code:not(.hljs)').forEach((el) => {
      hljs.highlightBlock(el as HTMLElement)
    })
  }

  beforeDestroy() {
    if (this.remark42Instance) {
      this.remark42Instance.destroy()
    }
  }

  beforeRouteLeave() {
    if (this.remark42Instance) {
      this.remark42Instance.destroy()
    }
  }

  @Watch('$route.path')
  onRouteChange() {
    this.initRemark42()
  }

  initRemark42() {
    if (process.client && this.remark42Config && window.REMARK42) {
      if (this.remark42Instance) {
        this.remark42Instance.destroy()
      }

      this.remark42Instance = window.REMARK42.createInstance({
        ...this.remark42Config,
        node: this.$refs.remark42 as HTMLElement,
        host: this.remark42Config.host,
        site_id: this.remark42Config.siteId,
      })
    }
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
