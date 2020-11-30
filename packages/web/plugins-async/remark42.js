/* eslint-disable camelcase */
const remark_config = {
  host: 'https://remark42.polv.cc',
  siteId: 'polv',
  locale: 'en',
}

;(function (c) {
  for (let i = 0; i < c.length; i++) {
    const d = document
    const s = d.createElement('script')
    s.src = remark_config.host + '/web/' + c[i] + '.js'
    s.defer = true
    ;(d.head || d.body).appendChild(s)
  }
})(['embed'])
