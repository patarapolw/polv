---
title: How do I create an SEO-friendly URL?
date: '2020-01-27 00:00 +07:00'
tag:
  - dev.to
  - discuss
  - javascript
  - seo
---

In my understanding,

- Create a human readable URL
- Shorten the URL, like 60 words, including `location.origin`
- Only `-` punctuation is preferred

<!-- excerpt_separator -->

Some questions remain unanswered, or unsure...

- Is [unidecode](https://www.npmjs.com/package/unidecode-plus) necessary, especially for non-ASCII scripts, such as CJK or Thai?
- Is extending with short strings problematic, such as with [nanoid](https://github.com/ai/nanoid), just like in `dev.to`?

As a matter of fact, I have already create [a package](https://www.npmjs.com/package/seo-friendly-slugify) as per my need.

```yaml link
description: >-
  Create SEO-friendly URL from any string, by stripping certain words, replacing
  punctuations, and shortening the string. Also works with Unicode characters. -
  patarapolw/seo-friendly-slugify
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
title: patarapolw/seo-friendly-slugify
language: en
type: object
url: 'https://github.com/patarapolw/seo-friendly-slugify'
provider: GitHub
```
