---
title: Vue SFC support (Vetur) not working for you? There are simple ways out. (Possibly also other SFC's, e.g. Svelte.)
date: 2020-09-11T00:00:00+07:00
tag:
  - vue
  - svelte
  - vscode
  - webdev
---

As I have complained about TypeScript support in SFC's, including Vue and Svelte. There seem to be simple ways out, at least for Vue.

<%- xCard({
  href: 'https://dev.to/patarapolw/why-are-we-using-single-file-components-in-the-first-place-1nl3',
  image: 'https://dev.to/social_previews/article/434142.png',
  title: 'Why are we using single file components in the first place?',
  description: "Be it Vue, Svelte or Riot; I feel that VSCode has hard time check for TypeScript inside it...  Vue's..."
}) %>

<!-- excerpt -->

## Easiest way

Do you know that your `HelloWorld.vue` can be as simple as

```vue
<template src="./HelloWorld/index.html" />
<script lang="ts" src="./HelloWorld/index.ts" />
<style scoped lang="scss" src="./HelloWorld/index.scss">
```

Also, from my playing around, I can omit `lang="ts"`, but not `lang="scss"`.

## Omitting `*.vue` extension

This is possible too, via Webpack settings.

```js
// vue.config.js

module.exports = {
  configureWebpack (config) {
    config.resolve.extensions.unshift('.vue')
  }
}
```

## Folderize everything

It is also possible to use `./HelloWorld` instead of `./HelloWorld/index.vue` (or `./HelloWorld.vue`).

- `./HelloWorld/index.vue`

```vue
<template src="./index.html" />
<script lang="ts" src="./index.ts" />
<style scoped lang="scss" src="./index.scss">
```

Noted that because you unshifted, instead of pushing, `index.vue` will be prioritized before `index.ts`.

Also, via this way, you can also create `./index.spec.ts` (i.e. testing file).

## Other kinds of Single File Components

I haven't tested with Svelte, but it would be nice, because I wouldn't have to worry about TypeScript support of [Svelte language server of VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

I believe [it should also work](https://github.com/sveltejs/svelte-preprocess#external-files).
