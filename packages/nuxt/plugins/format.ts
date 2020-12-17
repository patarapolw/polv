import Vue from 'vue'

Vue.filter('formatDate', (s?: string | number) => {
  return s
    ? new Date(s).toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      })
    : ''
})
