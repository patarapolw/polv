---
title: I wrote an ORM for SQLite
date: '2020-02-16 00:00 +07:00'
tag:
  - dev.to
  - javascript
  - sql
  - typescript
---

It starts with inter-op with [mongoose](https://mongoosejs.com/), and inspired from [Typegoose](https://github.com/typegoose/typegoose).

It is an ORM that

- Can query by Mongo-like query
- Auto-convert back-and-forth for JSON \<=> TEXT, Date \<=> INTEGER and Boolean \<=> INTEGER

For Mongo-like query, it can be tested here -- <https://q2search.herokuapp.com/LiteORM> (The actual Mongo-like query is in the console)

<!-- excerpt_separator -->

Still, there are something that would be hard to do / cannot do...

- Case-sensitive LIKE (LIKE in SQLite is case-insensitive)
- Query by RegExp (I use `LIKE '%'||$identifier||'%'` instead. RegExp queries need re-compile.)
- Limited update / delete (like `LIMIT 1` ==> I would have to re-compile SQLite)

```yaml link
description: >-
  A simple wrapper for sqlite; with typings based on TypeScript decorators and
  reflect-metadata. With async eventemitter (emittery). Focusing on JSON, Date,
  and MongoDB interop. - patarapolw/liteorm
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/liteorm
language: en
type: object
url: 'https://github.com/patarapolw/liteorm'
provider: GitHub
```
