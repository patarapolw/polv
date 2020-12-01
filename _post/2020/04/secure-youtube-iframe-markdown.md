---
title: Securely embed YouTube and other iframe elements in Markdown
date: 2020-04-30T00:00:00+07:00
tag:
  - markdown
  - security
---

You can use any markdown implementation, including MarkdownIt, but first you have to make it insecure first, by allowing HTML.

```js
const markdownIt = MarkdownIt({
  html: true
})
```

Then, use [DOMPurify](https://github.com/cure53/DOMPurify), but allow `<iframe>` tag, [including related attributes](https://stackoverflow.com/questions/60299226/how-to-allow-an-iframe-tag-in-dompurify-including-all-of-its-attributes).

Then, sanitize insecure iframes later.

```js
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe') {
    const src = node.getAttribute('src') || ''
    if (!src.startsWith('https://www.youtube.com/embed/')) {
      return node.parentNode?.removeChild(node)
    }
  }
})
```

<!-- excerpt_separator -->

## Other useful tags

As for `<style>` tag, I think it can be enabled, but always wrap it in [scopeCSS](https://www.npmjs.com/package/scope-css) or something similar.

As for `<script>` tag, I recommend you not to use it at all, but if you must, you need post-processing after attaching to DOM to run it.

```js
el.querySelectorAll('script').forEach((el0) => {
  el0.replaceWith(el0.cloneNode(true))
})
```
