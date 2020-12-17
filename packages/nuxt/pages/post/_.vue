<template>
  <PostFull :post="post" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PostFull from '@/components/PostFull.vue'
import { IPostSerialized } from '~/server/db'
import { THEME } from '~/assets/global'

@Component({
  components: {
    PostFull,
  },
  layout: 'blog',
  async asyncData({ app, params, error }) {
    try {
      const {
        title,
        image,
        tag,
        content,
        contentHtml,
        date,
      } = (await app.$axios.$get('/api', {
        params: {
          path: params.pathMatch,
        },
      }))!

      return {
        post: {
          title,
          image,
          tag,
          content,
          contentHtml,
          date,
        },
      }
    } catch (_) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
})
export default class PostPage extends Vue {
  post!: IPostSerialized

  head() {
    const { title: _title, content, tag, image } = this.post
    const title = `${_title} - ${THEME.title}`
    const description = content.substr(0, 140)

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        ...(tag
          ? [
              {
                hid: 'keywords',
                name: 'keywords',
                content: tag.join(','),
              },
            ]
          : []),
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: description,
        },
        ...(image
          ? [
              {
                hid: 'og:image',
                property: 'og:image',
                content: image,
              },
              {
                hid: 'twitter:image',
                property: 'twitter:image',
                content: image,
              },
            ]
          : []),
      ],
    }
  }
}
</script>
