---
title: 'A guide to using TypeScript in Vue, with maximal VSCode IntelliSense'
date: '2020-01-14 00:00 +07:00'
tag:
  - dev.to
  - typescript
  - vscode
  - vue
---

As a lover of TypeScript InteliSense and Vue, I have always tried to use TypeScript in Vue, but [Vetur](https://github.com/vuejs/vetur) isn't as smart as it should...

- It doesn't suggest as well as raw `*.ts`.
- It doesn't work well with a Monorepo / non-root -- <https://github.com/vuejs/vetur/issues/815>

So, I have found some fixes --

<!-- excerpt_separator -->

After, `vue create <APP_NAME>`

- Change `src/App.vue` to `src/pages/App/index.(tsx|css)`
- Change `components/HelloWorld.vue` to `src/components/HelloWorld/index.(tsx|css)`
- Change `.eslintrc.js` to

```js
module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
```

- I seems to not need to change `.babelrc` as in <https://github.com/vuejs/jsx>, nor install additional packages.

`src/pages/App/index.tsx` will be the following

```jsx
import { Component, Vue } from 'vue-property-decorator'

import HelloWorld from '@/components/HelloWorld'

import './index.css'

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  render () {
    return (
      <div id="app">
        <img alt="Vue logo" src={ require('@/assets/logo.png') } />
        <HelloWorld props={ { msg: 'Welcome to Your Vue.js + TypeScript App' } } />
      </div>
    )
  }
}
```

About `src/components/HelloWorld/index.tsx`, you could probably [guess](https://github.com/patarapolw/vue-typescript-suggestions/tree/master//packages/vue-sample/src/components/HelloWorld/index.tsx), but in short,

- There needs to be a `/>` or a closing tag.
- Props might not work properly. You need `props={ { msg: 'Welcome to Your Vue.js + TypeScript App' } }`.
- Don't forget to add `this.`
- `require('@/assets/logo.png')` seems to work because of some Webpack loader in Vue CLI.

## TLDR / Take Home Message

- [Vetur in VSCode](https://github.com/vuejs/vetur) does not always work fully for TypeScript, especially in a [Monorepo](https://github.com/vuejs/vetur/issues/815)
  - The best fix is indeed, do not use TypeScript in `*.vue`
  - One of the workarounds is `<script lang="ts" src="./index.ts">`
- [Vue template string isn't as smart as TypeScript Intellisense](https://dev.to/skyrpex/comment/6m6j).
  - The workaround is, do not use `<template>`. Use `*.tsx` (or `*.jsx`) instead.
- It is still simple to reference **foldered component** if you filename is `./index.tsx`
  - `import HelloWorld from '@/components/HelloWorld'` for example, will reference `@/components/HelloWorld/index.tsx`, will full IntelliSnese.
- `@angular/cli`'s `ng generate component App` doesn't even create a Single File Component, but instead create a single folder with multiple components.

```txt
./src/app/comp
├── comp.component.html
├── comp.component.scss
├── comp.component.spec.ts
└── comp.component.ts
```

## Summary

In summary, do not use `*.vue`, if you want a better IntelliSense. There are other approaches in component-based structure; like a folder.

Why does Vue adopt Single File Components at all, as it isn't necessarily better than Angular's?

I have also tried <https://github.com/vuejs/jsx>, but Vue CLI seems to already support JSX by default.

If you stuck somewhere, see this repo. I might also add Nuxt in the future.

```pug parsed
a(data-make-html="card" href="https://github.com/patarapolw/vue-typescript-suggestions")
  | https://github.com/patarapolw/vue-typescript-suggestions
  pre(data-template style="display: none;").
    image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
    title: patarapolw/vue-typescript-suggestions
    description: >-
      An example repo for using TypeScript in Vue, with maximal VSCode suggestions -
      patarapolw/vue-typescript-suggestions
```
