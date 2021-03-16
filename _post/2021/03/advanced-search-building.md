---
title: Search engine building tutorial, that supports advanced search syntaxes.
date: 2021-03-18T00:00:00+07:00
tag:
  - search
  - query
  - querystring
  - fts
  - full-text-search
---

- It should support `AND`, `OR`, `NOT`; and perhaps brackets `()`.
- Another part of it, though, is about optimization and fuzzy searches.
  - Fast even for a large body of text.
  - Realizes pluralization.
  - Forgiving of minor typos.

<!-- excerpt -->

## Advanced search syntaxes

I have thought about this a lot in the past.

- [Letting users search the database with a simple one-liner string (and let user decide which field to search)](https://dev.to/patarapolw/letting-users-search-the-database-with-a-simple-one-liner-string-and-let-user-decide-which-field-to-search-242n)
- [What features would you want for a `q` Querystring parser? (e.g. full-text-search, or more?)](https://dev.to/patarapolw/what-features-would-you-want-for-a-querystring-parser-e-g-full-text-search-or-more-370)

The easiest way is to use [lunr.js](https://lunrjs.com/guides/searching.html)'s syntaxes.

- Default connector is `AND`.
- To make an `OR`, use `?expression`.
- Search is normally case-insensitive, i.e. `a` and `A` means the same thing.
- `+expression` means exactly match, and case-sensitive.
- `-expression` means negation.
- Not only `:`, but also `>` and `<` is used to specify comparison. For example, `+foo:bar`, `count>1`.
- Date comparison is enabled.
  - Special keyword: `NOW`.
  - `+1h` means next 1 hour. `-1h` mean 1 hour ago.
    - Available units are `y (year)`, `M (month)`, `w (week)`, `d (day)`, `h (hour)`, `m (minute)`.

You can see my experiment and [playground](https://q2search.herokuapp.com) here.

<%- xCard({
  href: 'https://github.com/patarapolw/qsearch',
  image: 'https://avatars.githubusercontent.com/u/21255931?s=400&amp;v=4',
  title: 'patarapolw/qsearch',
  description: 'Search a database with a string. Designed for end-users. - patarapolw/qsearch'
}) %>

## Full text search and fuzzy search

I made a list, here.

<%- xCard({
  href: 'https://dev.to/patarapolw/what-s-your-favorite-full-text-search-implementation-4659',
  image: 'https://dev.to/social_previews/article/482954.png',
  title: "What's your favorite full-text search implementation?",
  description: 'Also on Quora - What is better, a custom Google search or Algolia?   Algolia Elasticsearch, Lucene, S...'
}) %>

- Algolia
- Elasticsearch, Lucene, Solr
- Google custom search

How does it compare to search engines with web crawlers?

- Yahoo
- Bing
- DuckDuckGo
- Yandex
- Baidu

What about pure JavaScript implementations?

- js-search
- lunr, elasticlunr

RDBMS and NoSQL's feature?

- SQLite FTS4, FTS5
- PostgreSQL plugin
- MongoDB

Or, some other implementations, like Python's Whoosh?

## Implementing both together

It is easier if you use RDBMS and NoSQL's features. PostgreSQL, MySQL and MongoDB (but not SQLite) allows you to create an index on a TEXT column, and make a full-text index.

Furthermore, PostgreSQL also has pgroonga, that does not only have more language support that native tsvector; but also can index anything, including `JSONB`.

<%- xCard({
  href: 'https://pgroonga.github.io/',
  title: "Make PostgreSQL fast full text search platform for all languages!",
  description: 'Make PostgreSQL fast full text search platform for all languages!'
}) %>

Now comes the algorithm for the syntax. I made it for PostgreSQL in another project.

https://github.com/patarapolw/cjclub/blob/9f9c47260e7471d64e3def0c86cc3fea0ac36669/packages/server/src/util/token.ts#L16
