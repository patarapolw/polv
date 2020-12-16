<template>
  <section class="my-4 mx-2">
    <nav
      class="pagination is-rounded"
      role="navigation"
      aria-label="pagination"
    >
      <nuxt-link
        v-if="page > 1"
        :to="makePageUrl(page - 1)"
        class="pagination-previous"
      >
        <span class="icon">
          <FontAwesome icon="caret-left" />
        </span>

        <span :class="$style['sr-only']"> Previous </span>
      </nuxt-link>

      <nuxt-link
        v-if="page < total - 1"
        :to="makePageUrl(page + 1)"
        class="pagination-next"
      >
        <span class="icon">
          <FontAwesome icon="caret-right" />
        </span>

        <span :class="$style['sr-only']"> Next </span>
      </nuxt-link>

      <ul class="pagination-list">
        <li v-if="page > 1">
          <nuxt-link
            :to="makePageUrl(1)"
            class="pagination-link"
            aria-label="go to page 1"
          >
            1
          </nuxt-link>
        </li>

        <li v-if="page > 3">
          <span class="pagination-ellipsis"> &hellip; </span>
        </li>

        <li v-if="page > 2">
          <nuxt-link
            :to="makePageUrl(page - 1)"
            class="pagination-link"
            :aria-label="`go to page ${page - 1}`"
          >
            {{ page - 1 }}
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            :to="makePageUrl(page)"
            class="pagination-link is-current"
            :aria-label="`go to page ${page}`"
            aria-current="page"
          >
            {{ page }}
          </nuxt-link>
        </li>

        <li v-if="page < total - 1">
          <nuxt-link
            :to="makePageUrl(page + 1)"
            class="pagination-link"
            :aria-label="`go to page ${page + 1}`"
          >
            {{ page + 1 }}
          </nuxt-link>
        </li>

        <li v-if="page < total - 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>

        <li v-if="page < total">
          <nuxt-link
            :to="makePageUrl(total)"
            class="pagination-link"
            :aria-label="`go to page ${total}`"
          >
            {{ total }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Pagination extends Vue {
  @Prop({ required: true }) total!: string

  get page() {
    return parseInt((this.$route.path.match(/\/(\d+)?$/) || [])[1] || '1')
  }

  makePageUrl(p: number) {
    let path = this.$route.path
    if (!(path.startsWith('/tag') || path.startsWith('/blog'))) {
      path = '/blog'
    }

    return this.$router.resolve({
      path,
      query: {
        ...this.$route.query,
        page: p.toString(),
      },
    }).href
  }
}
</script>

<style module scoped src="~/styles/tw.module.css"></style>
