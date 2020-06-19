---
title: Only flat file CMS and serverless functions are enough for my needs
date: 2020-06-02
tag:
  - cms
  - serverless
  - netlify
  - dev.to
  - lunr
---

This also obliviate the need to monitor your own database or entrust a third party to do it for you.

Still, you might need some functions you cannot rely on clients' web browser, such as [adding search](https://www.gatsbyjs.org/docs/adding-search/). Downloading indexes to client's machine is expensive and bad for SEO.

```yaml link
description: >-
  See below for a list of guides in this section, or keep reading for an
  overview on adding search functionality to your site. Site search…
icon: >-
  https://www.gatsbyjs.org/icons/icon-96x96.png?v=edf3d310d67f8284a562bc3a58c3e761
image: >-
  https://www.gatsbyjs.org/static/gatsby-icon-4a9773549091c227cd2eb82ccd9c5e3a.png
title: Adding Search
language: en
type: article
url: 'https://www.gatsbyjs.org/docs/adding-search/'
provider: GatsbyJS
```

<!-- excerpt_separator -->

So, I use [lunr.js](https://lunrjs.com/guides/searching.html) instead.

```yaml link
description: 'A bit like Solr, but much smaller and not as bright - olivernn/lunr.js'
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars1.githubusercontent.com/u/35913?s=100&v=4'
title: olivernn/lunr.js
language: en
type: object
url: 'https://github.com/olivernn/lunr.js'
provider: GitHub
```

I built two essential files on the fly, before starting up a Nuxt server.

- `db.json` created by `JSON.string(glob)`
- `idx.json` created by `JSON.stringify(lunr)`

See,

```yaml link
description: |
  polv's homepage -- /scripts/init.js
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/polv
language: en
type: object
url: >-
  https://github.com/patarapolw/polv/blob/1d569576d26d4332b47592054f2900f7eb9c5571/scripts/init.js
provider: GitHub
```

Do you know that you can rollup a temporary server, potentially needed by `gatsby build` or `nuxt generate`? Such solutions are

```yaml link
description: >-
  Get a full fake GraphQL API with zero coding in less than 30 seconds. -
  marmelab/json-graphql-server
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars2.githubusercontent.com/u/3116319?s=100&v=4'
title: marmelab/json-graphql-server
language: en
type: object
url: 'https://github.com/marmelab/json-graphql-server'
provider: GitHub
```

```yaml link
description: >-
  Get a full fake REST API with zero coding in less than 30 seconds (seriously)
  - typicode/json-server
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars0.githubusercontent.com/u/5502029?s=100&v=4'
title: typicode/json-server
language: en
type: object
url: 'https://github.com/typicode/json-server'
provider: GitHub
```

I still have an editor / CMS, though; but it specifically targets a flat file folder,

```yaml link
description: >-
  Flat file CMS generator and manager.
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/superflat
language: en
type: object
url: 'https://github.com/patarapolw/superflat'
provider: GitHub
```

Did I mentioned that I think [I was wrong in thinking that I need a CMS](https://dev.to/patarapolw/comment/pljm)? The truth is I still need a CMS, but I don't want to monitor a database.

One more thing I need is commenting engine. Indeed, an option is just use Disqus, but in the end, I hosted by own using Remark42, with [a little tweak to make it work with SPA](https://github.com/umputun/remark42/pull/723).

```yaml link
description: >-
  comment engine. https://remark42.com
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars1.githubusercontent.com/u/535880?s=100&v=4'
title: umputun/remark42
language: en
type: object
url: 'https://github.com/umputun/remark42'
provider: GitHub
```
