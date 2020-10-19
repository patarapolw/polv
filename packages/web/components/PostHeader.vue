<template>
  <section class="mb-4">
    <a
      class="el-author"
      :href="author.url"
      target="_blank"
      rel="noreferrer noopener nofollow"
    >
      <span class="image">
        <img class="is-rounded" :src="authorImage" :alt="author.name" />
      </span>
      <span>{{ author.name }}</span>
    </a>

    <div :class="$style['flex-grow']" />

    <div>{{ dateString }}</div>
  </section>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class PostHeader extends Vue {
  @Prop({ required: true }) post!: any

  author = JSON.parse(process.env.author!)

  get authorImage() {
    return this.author.image
  }

  get dateString() {
    const m = this.post.date ? dayjs(this.post.date) : null
    return m ? m.format('ddd D MMMM YYYY') : ''
  }
}
</script>

<style module scoped src="~/styles/tw.module.css"></style>

<style scoped>
section:first-child {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: auto;
}

.el-author {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  justify-content: center;
}

.el-author img {
  border: none;
  display: block;
  width: 24px;
  min-width: 24px;
}

.el-author span + span {
  margin-left: 0.5rem;
}
</style>
