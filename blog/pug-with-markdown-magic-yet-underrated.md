---
title: 'Pug with Markdown is Magic, yet underrated'
date: '2020-01-04 00:00 +07:00'
tag:
  - dev.to
  - frontend
  - javascript
  - markdown
  - pug
  - vue
---

## What is Pug

Pug is a high-performance template engine heavily influenced by Haml and implemented with JavaScript for Node.js and browsers.

Pug uses whitespace syntax, and is Tab / Space -sensitive, just like Markdown and Python

Pug is mainly a template engine for Node.js, and cannot be installed for Webpack via NPM/Yarn, however there is <https://github.com/pugjs/pug#browser-support> but it is a very large file. However, I created [HyperPug](https://github.com/patarapolw/hyperpug) a while ago, and it is relatively small.

<!-- excerpt_separator -->

## Pug with Markdown

Pug integrates nicely with Markdown, via [Filters](https://pugjs.org/language/filters.html).

```pug
div
  :markdown
    ## Hello
```

This can be enabled with Markdown engines, like [Showdown](https://github.com/showdownjs/showdown) or [Markdown-it](https://github.com/markdown-it/markdown-it).

```javascript
import hyperpug from 'hyperpug'
import showdown from 'showdown'

const mdConverter = new showdown.Converter()

console.log(hyperpug.compile({
  filters: {
    markdown: (s: string) => mdConverter.makeHtml(s)
  }
})(str))
```

## Creating a Markdown extension is easy, with Showdown.js

For an official tutorial, see <https://github.com/showdownjs/showdown/wiki/extensions#creating-showdown-extensions>

You can even create a Pug extension inside Markdown, with [indented-filter](https://github.com/patarapolw/indented-filter)

```javascript
import { createIndentedFilter } from "indented-filter";
import showdown from "showdown";

const mdConverter = new showdown.Converter();

mdConverter.addExtension({
  type: "lang",
  filter: createIndentedFilter("^^pug", (str) => {
    return pug.render(str)
  })
}, "pug");
```

Now, you can use Pug inside Markdown.

```markdown
^^pug.
  h1 Hello
```

A roundabout Pug inside Markdown, and also with Markdown inside Pug is also possible, see <https://github.com/patarapolw/zhlab/blob/master/web/utils/make-html.ts#L10>

## Enabling extended Pug (with Markdown) inside Vue, Nuxt, or simply [pug-plain-loader](https://www.npmjs.com/package/pug-plain-loader)

I made this possible with my new NPM package -- <https://github.com/patarapolw/deepfind>

```javascript
// nuxt.config.js

import deepfind from '@patarapolw/deepfind'
import showdown from 'showdown'

const mdConverter = new showdown.Converter()

export default {
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      for (const r of deepfind(config, 'pug-plain-loader')) {
        if (!Array.isArray(r)) {
          r.options = r.options || {}
          r.options.filters = {
            markdown: (s: string) => mdConverter.makeHtml(s)
          }
        }
      }
    }
  }
}
```

```javascript
// vue.config.js

const deepfind = require('@patarapolw/deepfind').default
const showdown = require('showdown')

const mdConverter = new showdown.Converter()

module.exports = {
  configureWebpack: (config) => {
    for (const r of deepfind(config, 'pug-plain-loader')) {
      if (!Array.isArray(r)) {
        r.options = r.options || {}
        r.options.filters = {
          markdown: (s: string) => mdConverter.makeHtml(s)
        }
      }
    }
  }
}
```
