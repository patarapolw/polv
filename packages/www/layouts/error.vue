<template>
  <div>
    <section>
      <h2 v-if="error.statusCode === 404">Page not found</h2>
      <pre v-else style="width: 100%">{{ error }}</pre>
    </section>
    <section>
      <NuxtLink to="/">Home page</NuxtLink>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'error',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'], // you can set a custom layout for the error page
}
</script>
