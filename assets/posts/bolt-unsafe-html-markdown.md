---
title: Injecting unsafe HTML into Bolt entries + CodeMirror/UIKit editor
date: '2019-07-09 00:00 +07:00'
image: >-
  https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTDO_p0QiaGehExbdLMqCY2MT7TP759whHkorR0MegIwQ4IHb4R
tag:
  - bolt-cms
  - markdown
  - php
---

By default, both [Markdown field](https://docs.bolt.cm/3.6/fields/markdown#input-sanitisation) and [HTML field](https://docs.bolt.cm/3.6/fields/html#input-sanitisation) is available for [Bolt CMS](https://bolt.cm/), but sanitation is done before inserting into the database, making rendering of certain elements impossible; especially, for those starting with `<` (Unless you use `&lt;`).

So, I fixed this while preserving the editor (CodeMirror/UIKit) here.

```yaml link
description: >-
  Bolt extension to insert unsafe markdown and HTML, while preserving the editor
  - patarapolw/bolt-markup
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
title: patarapolw/bolt-markup
language: en
type: object
url: 'https://github.com/patarapolw/bolt-markup'
provider: GitHub
```
