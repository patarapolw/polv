import '@fortawesome/fontawesome-svg-core/styles.css'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebookF,
  faGithub,
  faInstagram,
  faQuora,
  faReddit,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
  faAt,
  faCaretLeft,
  faCaretRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

config.autoAddCss = false

library.add(
  faSearch,
  faCaretRight,
  faCaretLeft,
  faAt,
  faTwitter,
  faFacebookF,
  faInstagram,
  faGithub,
  faReddit,
  faQuora
)

Vue.component('FontAwesome', FontAwesomeIcon)
