<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  middleware(ctx) {
    ctx.redirect('/blog')
  },
})
</script>
