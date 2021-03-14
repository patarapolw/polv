import { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ app }) => {
  const { remark42 } = app.$accessor.theme.comment || {}

  if (remark42) {
    ;(function (c) {
      for (let i = 0; i < c.length; i++) {
        const d = document
        const s = d.createElement('script')
        s.src = remark42.host + '/web/' + c[i] + '.js'
        s.defer = true
        ;(d.head || d.body).appendChild(s)
      }
    })(['embed'])
  }
}

export default plugin
