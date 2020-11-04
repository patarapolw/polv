<template>
  <section class="PostHeader">
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

    <div class="flex-row">
      <div class="spacer" />
      <div>{{ dateString }}</div>
    </div>
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

<style lang="scss" scoped>
.PostHeader {
  display: flex;
  flex-direction: row;

  > * {
    margin-bottom: 0.5rem;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    flex-grow: 1;

    .spacer {
      flex-grow: 1;
    }
  }

  @media (max-width: 501px) {
    flex-direction: column-reverse;

    .flex-row {
      margin-top: -1rem;
    }
  }
}

.el-author {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  align-items: center;

  img {
    border: none;
    display: block;
    width: 24px;
    min-width: 24px;
  }

  span + span {
    margin-left: 0.5rem;
  }
}
</style>
