<template>
  <section v-show="isReady" class="container m-2">
    <h1 class="title is-4">Sorry, but no post can be found.</h1>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      isReady: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.isReady = true
    }, 1000)
  },
})
</script>
