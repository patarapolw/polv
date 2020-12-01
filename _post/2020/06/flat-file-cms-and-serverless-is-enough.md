---
title: Only flat file CMS and serverless functions are enough for my needs
date: 2020-06-02T00:00:00+07:00
tag:
  - cms
  - serverless
  - netlify
  - lunr
category:
  - pinned
---

This also obliviate the need to monitor your own database or entrust a third party to do it for you.

Still, you might need some functions you cannot rely on clients' web browser, such as [adding search](https://www.gatsbyjs.org/docs/adding-search/). Downloading indexes to client's machine is expensive and bad for SEO.

<%- xCard({
  href: 'https://www.gatsbyjs.org/docs/adding-search/',
  image: 'https://www.gatsbyjs.org/static/gatsby-icon-4a9773549091c227cd2eb82ccd9c5e3a.png',
  title: 'Adding Search',
  description: 'See below for a list of guides in this section, or keep reading for an '
    + 'overview on adding search functionality to your site. Site search…'
}) %>

<!-- excerpt_separator -->

So, I use [lunr.js](https://lunrjs.com/guides/searching.html) instead.

<%- xCard({
  href: 'https://github.com/olivernn/lunr.js',
  image: 'https://avatars1.githubusercontent.com/u/35913?s=400&v=4',
  title: 'olivernn/lunr.js',
  description: 'A bit like Solr, but much smaller and not as bright - olivernn/lunr.js'
}) %>

I built two essential files on the fly, before starting up a Nuxt server.

- `db.json` created by `JSON.string(glob)`
- `idx.json` created by `JSON.stringify(lunr)`

See,

<%- xCard({
  href: 'https://github.com/patarapolw/polv/blob/1d569576d26d4332b47592054f2900f7eb9c5571/scripts/init.js',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/polv',
  description: "polv's homepage. -- /scripts/init.js"
}) %>

Do you know that you can rollup a temporary server, potentially needed by `gatsby build` or `nuxt generate`? Such solutions are

<%- xCard({
  href: 'https://github.com/marmelab/json-graphql-server',
  image: 'https://avatars2.githubusercontent.com/u/3116319?s=400&v=4',
  title: 'marmelab/json-graphql-server',
  description: 'Get a full fake GraphQL API with zero coding in less than 30 seconds. - '
    + 'marmelab/json-graphql-server'
}) %>

<%- xCard({
  href: 'https://github.com/typicode/json-server',
  image: 'https://avatars0.githubusercontent.com/u/5502029?s=400&v=4',
  title: 'typicode/json-server',
  description: 'Get a full fake REST API with zero coding in less than 30 seconds (seriously) '
    + '- typicode/json-server'
}) %>

I still have an editor / CMS, though; but it specifically targets a flat file folder,

<%- xCard({
  href: 'https://github.com/patarapolw/superflat',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/superflat',
  description: 'Flat file CMS generator and manager. Contribute to patarapolw/superflat '
    + 'development by creating an account on GitHub.'
}) %>

Did I mentioned that I think [I was wrong in thinking that I need a CMS](https://dev.to/patarapolw/comment/pljm)? The truth is I still need a CMS, but I don't want to monitor a database.

One more thing I need is commenting engine. Indeed, an option is just use Disqus, but in the end, I hosted by own using Remark42, with [a little tweak to make it work with SPA](https://github.com/umputun/remark42/pull/723).

<%- xCard({
  href: 'https://github.com/umputun/remark42',
  image: 'https://avatars1.githubusercontent.com/u/535880?s=400&v=4',
  title: 'umputun/remark42',
  description: 'comment engine. Contribute to umputun/remark42 development by creating an '
    + 'account on GitHub.'
}) %>
