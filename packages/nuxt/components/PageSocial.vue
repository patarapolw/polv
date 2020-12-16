<template>
  <div
    :class="
      [
        $style['inline-flex'],
        $style['justify-center'],
        $style['self-center'],
      ].join(' ')
    "
  >
    <a
      v-if="social.facebook"
      class="navbar-item"
      :href="`https://facebook.com/${social.facebook}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'facebook-f']" />
      </span>
    </a>

    <a
      v-if="social.twitter"
      class="navbar-item"
      :href="`https://twitter.com/${social.twitter}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'twitter']" />
      </span>
    </a>

    <a
      v-if="social.reddit"
      class="navbar-item"
      :href="`https://www.reddit.com/user/${social.reddit}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'reddit']" />
      </span>
    </a>

    <a
      v-if="social.quora"
      class="navbar-item"
      :href="`https://www.quora.com/profile/${social.quora}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'quora']" />
      </span>
    </a>

    <a
      v-if="social.linkedin"
      class="navbar-item"
      :href="`https://www.linkedin.com/in/${social.linkedin}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'linkedin-in']" />
      </span>
    </a>

    <a
      v-if="social.github"
      class="navbar-item"
      :href="`https://github.com/${social.github}`"
      target="_blank"
      rel="noopener nofollow noreferrer"
    >
      <span class="icon">
        <FontAwesome :icon="['fab', 'github']" />
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageSocial extends Vue {
  social = JSON.parse(process.env.social!)
}
</script>

<style module scoped src="~/styles/tw.module.css"></style>
