/* eslint-disable camelcase */

import { THEME } from './global'

export type Theme = 'light' | 'dark'

export interface CommentsConfig {
  host: string
  site_id: string
  url?: string
  max_shown_comments?: number
  theme?: Theme
  page_title?: string
  node?: string | HTMLElement
  locale?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __colors__?: any
}

declare global {
  interface Window {
    remark_config: CommentsConfig
    REMARK42: {
      changeTheme(theme: Theme): void
      destroy?: () => void
      createInstance: (
        remark_config: CommentsConfig
      ) =>
        | {
            changeTheme(theme: Theme): void
            destroy(): void
          }
        | undefined
    }
  }
}

if (process.browser && THEME?.comment?.remark42) {
  ;(function (c) {
    for (let i = 0; i < c.length; i++) {
      const d = document
      const s = d.createElement('script')
      s.src = THEME.comment.remark42.host + '/web/' + c[i] + '.js'
      s.defer = true
      ;(d.head || d.body).appendChild(s)
    }
  })(['embed'])
}
