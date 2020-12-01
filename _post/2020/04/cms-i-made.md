---
title: CMS I made to feed Nuxt
date: 2020-04-21T00:00:00+07:00
tag:
  - cms
  - nuxt
---

I wonder what you are using to feed JAMstacks, such as Gatsby, Gridsome, Nuxt? Perhaps Wordpress or Strapi?

I made a solution myself for this question.

<%- xCard({
  href: 'https://dev.to/patarapolw/what-is-the-best-cms-to-feed-api-for-a-static-site-generator-ah0',
  image: 'https://dev.to/social_previews/article/248929.png',
  title: 'What is the best CMS to feed API for a static site generator?',
  description: 'The content is not going to be all dev-related, so dev.to API is not an '
    + 'option.  What about WordPress...'
}) %>

I created my own headless CMS and host on Google Cloud Platform (see <https://bd.polv.cc/api/doc>).

<!-- excerpt_separator -->

<%- xCard({
  href: 'https://github.com/patarapolw/blogdown-cms',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/blogdown-cms',
  description: 'Content Management System, to provide API endpoints for Static Site Generators '
    + 'or JAMStacks - patarapolw/blogdown-cms'
}) %>

I also extended it with LiquidJS (so as to be in similar style to <https://dev.to),> and it solved this problem. (via `{ % card url %}`)

<%- xCard({
  href: 'https://dev.to/patarapolw/is-there-a-tool-for-a-better-a-href-like-social-sharing-cards-h7d',
  image: 'https://dev.to/social_previews/article/310429.png',
  title: 'Is there a library for better <a href>\'s, like social sharing cards?',
  description: 'It seems to need a backend to fetch metadata so as to bypass CORS...  I can '
    + 'try to create my own (in...'
}) %>

It also solves [the search engine problem for JAMstacks](https://www.gatsbyjs.org/docs/adding-search/).

However, it doesn't provide a commenting engine. ([Although I have tried to create one.](https://dev.to/patarapolw/a-commenting-system-that-is-easy-to-self-host-and-completely-free-4od9)) Allowing people to post things is dangerous and difficult, IMO.

It is currently made with Vue, Tailwind and Element UI, BTW. I really concerned about [component frameworks and CSS frameworks I don't have to fight against](https://dev.to/patarapolw/looking-for-a-css-framework-that-i-don-t-have-to-fight-against-it-also-vue-framework-j3f).
