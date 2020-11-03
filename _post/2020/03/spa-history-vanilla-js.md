---
title: SPA with history mode router in vanilla JS (with potential for SSG)
date: '2020-03-02 00:00 +07:00'
tag:
  - dev.to
  - javascript
  - spa
  - vanilla-js
---

I don't know non-JavaScript-based Static Site Generators do it, but JS-based, like Gatsby, Nuxt, or Gridsome can prevent reloading and show transition between pages on `location.pathname` changes.

True SPA like Vue can do it too, but on first load, you can hasten JavaScript by using [prerender-spa-plugin](https://www.npmjs.com/package/vue-cli-plugin-prerender-spa).

I have just create an SPA with history mode router in vanilla JS, but I do use a bundler (Rollup).

<%- xCard({
  href: 'https://github.com/patarapolw/minimal-rollup-ts-pug-sass-template',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/minimal-rollup-ts-pug-sass-template',
  description: 'Rollup + TypeScript + Pug + SASS template with no plan for JavaScript '
    + 'frameworks, whatsoever - patarapolw/minimal-rollup-ts-pug-sass-template'
}) %>

<!-- excerpt_separator -->

BTW, I cannot just use Parcel, because I want to enable it for Electron as well. (But Electron shouldn't use history mode.)

## Why templating engine like Pug

Because I feel like it will minify HTML by default. Also, Pug is defaulted to be very tidy, with no burden of the closing tag.

Of course, you can use other templating engines, like EJS as well.

## Meta tags

[Meta tags](https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags) for Google, Facebook, and Twitter are as follow.

```pug
    meta(http-equiv="Content-Type", content="text/html;charset=UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")

    meta(name="description", content=description data-meta="description")
    meta(name="keywords", content=keywords data-meta="keywords")

    meta(property="og:title" content=title data-meta="title")
    meta(property="og:description" content=description data-meta="description")
    meta(property="og:image" content=image data-meta="image")
    meta(property="og:url" content=url data-meta="url")

    meta(property="twitter:title" content=title data-meta="title")
    meta(property="twitter:description" content=description data-meta="description")
    meta(property="twitter:image" content=image data-meta="image")
    meta(property="twitter:card" content="summary_large_image")

    link(rel="shortcut icon", href=`${favicon || 'favicon.ico'}`, type="image/x-icon")

    title(data-title=title data-meta="title")= title
```

I put `data-meta` and `data-title`, in case I need to edit it from JavaScript, so it is as simple as `document.querySelectorAll('[data-meta=...]')`.

## Module and nomodule

By default, Rollup (and [Snowpack](https://www.snowpack.dev)) specializes in the newer ES module, but `nomodule` fallbacks to SystemJS for lazy-loading.

```pug
    script(src="module/index.js" type="module")
    script(src="nomodule/index.js" nomodule)
```

Forgot to mention that SPA router uses lazy loading for faster loading time, and load only what is needed.

## Custom elements: `<app-router>` and `<a is="router-link">`

`<a is="router-link">` is to provide convenience for creating a href that also have base URL and hash sign.

`<app-router>` might not need to be made custom element, because it is always singleton anyway; but I use it to make the element class-based.

## `popstate` event

It is the event for page navigate that may have "state" in case HTML5 History is manipulated.

It can be superficially triggered by `window.dispatchEvent(new PopStateEvent('popstate'))`, which is the basis of `navigateTo` function.

```ts
export function navigateTo (to: string) {
  if (ROUTER_MODE === 'history') {
    history.pushState({ to }, '', to)
    window.dispatchEvent(new PopStateEvent('popstate', { state: { to } }))
  } else {
    location.replace(to)
  }
}
```

## `spa-rendered` event and `data-spa-rendered` attribute

This is to indicate that the SPA has finished loading and is now ready to be scraped by [Puppeteer](https://github.com/puppeteer/puppeteer) to create a multiple-page website.

I will try using it extensively, to see if it is any good.

<%- xCard({
  href: 'https://github.com/patarapolw/minimal-rollup-ts-pug-sass-template',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/minimal-rollup-ts-pug-sass-template',
  description: 'Rollup + TypeScript + Pug + SASS template with no plan for JavaScript '
    + 'frameworks, whatsoever - patarapolw/minimal-rollup-ts-pug-sass-template'
}) %>
