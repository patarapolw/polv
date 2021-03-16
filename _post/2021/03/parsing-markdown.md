---
title: Most Featureful Markdown Parser
date: 2021-03-16T00:00:00+07:00
tag:
  - markdown
  - markdown-preview-enhanced
  - mpe
  - mume
  - latex
  - pdf
---

My favorite implementation is [Markdown Preview Enhanced](https://github.com/shd101wyy/markdown-preview-enhanced), but to be exact, [@shd101wyy/mume](https://github.com/shd101wyy/mume), but I want a little more features...

<%- xCard({
  href: 'https://github.com/shd101wyy/mume',
  image: 'https://avatars.githubusercontent.com/u/1908863?s=400&amp;v=4',
  title: 'shd101wyy/mume',
  description: 'Powerful markdown tool. Contribute to shd101wyy/mume development by creating an account on GitHub.'
}) %>

<!-- excerpt -->

## Not only HTML, but also CSS (preprocessor) and JS enabled

I know there are security concerns, but you write your own text; so why care?

```html
<style>
h2 {
  color: red;
}
</style>
```

```html
<script>
alert('hello')
</script>
```

## Isolated CSS styling, and reusable components

With the power of Shadow DOM, CSS is not penetrated to the outside. (But JavaScript still do.)

## Web enabled, with server-side enhancements

I made an online playground, here. It is made from pasting bare URL - https://github.com/patarapolw/make-html.

<%- xCard({
  href: 'https://github.com/patarapolw/make-html',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/make-html',
  description: 'Make HTML from Markdown or Hyperpug. Contribute to patarapolw/make-html development by creating an account on GitHub.'
}) %>

However, when it is online, you need to care about security. (And avoid XSS injection, for example.)

<%- xCard({
  href: 'https://www.polv.cc/post/2020/04/secure-youtube-iframe-markdown',
  title: 'Securely embed YouTube and other iframe elements in Markdown',
  description: 'You can use any markdown implementation, including MarkdownIt, but first you have to make it insecure first, by allowing HTML.'
}) %>

## Live editor

If you have slow-to-render components, or reactive with JavaScript; like IFrame; you can prevent flickering with incremental DOM.

<%- xCard({
  href: 'https://dev.to/patarapolw/how-to-prevent-flickering-in-live-markdown-editor-1pd1',
  image: 'https://dev.to/social_previews/article/279001.png',
  title: 'How to prevent flickering in Live Markdown Editor',
  description: "Especially, for items that shouldn't load too often, like <iframe>.  In short, incremental-dom..."
}) %>

## You can save as PDF

See this post.

<%- xCard({
  href: 'https://www.polv.cc/post/2020/11/markdown-to-pdf-missing-pieces',
  title: 'Markdown to PDF: missing pieces from various approaches, and beyond HTML',
  description: 'et me say this first, the best way to create PDF from markdown is via web technology (Chrome / Puppeteer), because it is the closest to WSYIWYG (What You See Is What You Get), but it is not perfect.'
}) %>
