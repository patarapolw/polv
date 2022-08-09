/// <reference path="./env.d.ts" />

import 'bulma/css/bulma.css';
import './global.scss';
import './plugins/fontawesome';
import 'https://platform.twitter.com/widgets.js';

import { Theme } from 'vitepress';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Layout from './Layout.vue';

const theme: Theme = {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.
    // register global components
    app.component('FontAwesome', FontAwesomeIcon);
  },
};

export default theme;
