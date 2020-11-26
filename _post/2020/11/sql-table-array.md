---
title: SQL table design for Arrays, Dates and Indexes - what I learnt from ORM
date: 2020-11-26 22:00
tag:
  - sql
  - sqlite
  - nosql
  - orm
---

In short, you can fix it with proper comments and sectioning. Also, don't fear Many-To-Many relationships.

<!-- excerpt -->

## Creating SQL-based definitions

I did this with [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3), so even if it is JavaScript / TypeScript, I don't really need `await`.

```ts
  init() {
    this.db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS tag (
      id        INT PRIMARY KEY,
      [name]    TEXT NOT NULL UNIQUE COLLATE NOCASE
    );
    `)

    this.db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS token (
      [entry]       TEXT PRIMARY KEY,
      -- sub m2m
      -- sup m2m
      -- var m2m
      frequency     FLOAT,
      hanzi_level   INT,
      vocab_level   INT,
      -- tag m2m
      pinyin        TEXT,
      english       TEXT,
      [data]        TEXT -- json // This can be queried using JSON1 extension
    );

    CREATE INDEX IF NOT EXISTS idx_token_frequency ON token(frequency);
    CREATE INDEX IF NOT EXISTS idx_token_hanzi_level on token(hanzi_level);
    CREATE INDEX IF NOT EXISTS idx_token_vocab_level on token(vocab_level);

    CREATE TABLE IF NOT EXISTS token_sub (
      parent  TEXT NOT NULL REFERENCES token,
      child   TEXT NOT NULL REFERENCES token,
      PRIMARY KEY (parent, child)
    );

    CREATE TABLE IF NOT EXISTS token_sup (
      parent  TEXT NOT NULL REFERENCES token,
      child   TEXT NOT NULL REFERENCES token,
      PRIMARY KEY (parent, child)
    );

    CREATE TABLE IF NOT EXISTS token_var (
      parent  TEXT NOT NULL REFERENCES token,
      child   TEXT NOT NULL REFERENCES token,
      PRIMARY KEY (parent, child)
    );

    CREATE TABLE IF NOT EXISTS token_tag (
      [entry]   TEXT NOT NULL REFERENCES token,
      tag_id    INT NOT NULL REFERENCES tag,
      PRIMARY KEY ([entry], tag_id)
    );
    `)
  }
```

By the way, the deal with `/* sql */` is this VSCode extension - [Comment tagged templates](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates). I really recommend it over [my old deprecated post](https://dev.to/patarapolw/fake-tagged-template-string-literal-to-enable-syntax-highlighting-in-vscode-34g1).

![vscode-comment-tagged-templates](https://github.com/mjbvz/vscode-comment-tagged-templates/raw/master/docs/example.png)

## Making it ORM-like

Now, with `class` syntax for pseudo-ORM.

```ts
import sqlite3 from 'better-sqlite3'

class Db {
  db: sqlite3.Database

  constructor(public filename: string) {
    this.db = sqlite3(filename)
  }

  init() { ... }

  tagFindOrCreate(names: string[]): number[] { ... }

  tokenFindOrCreate(names: string[]): string[] { ... }

  ...
}
```

Actually, you do can group `methods` by major tables' names, but not so intuitive.

```ts
import sqlite3 from 'better-sqlite3'

class Db {
  tag = {
    findOrCreate: this.tagFindOrCreate.bind(this)
  }

  token = {
    findOrCreate: this.tokenFindOrCreate.bind(this)
  }

  ...
}
```

## How to create Arrays, Dates, JSON

Use within-`SELECT` aggregates (`json_group_array` / `group_concat`)

```sql
  SELECT
    [entry], pinyin, english, frequency,
    (
      SELECT group_concat(child, '') FROM token_sub WHERE parent = [entry] GROUP BY parent
    )   sub,
    (
      SELECT group_concat(child, '') FROM token_sup WHERE parent = [entry] GROUP BY parent
    )   sup,
    (
      SELECT group_concat(child, '') FROM token_var WHERE parent = [entry] GROUP BY parent
    )   [var]
  FROM token
```

About transforms to non-native data structures, (I know that is much easier some PostGres extension, or HarperDB,) you can signal that with certain naming conventions.

```ts
    zh.db
      .prepare(
        /* sql */ `
  SELECT
    [entry], _json_data, _date_updatedAt
    (
      SELECT json_group_array(child) FROM token_sub WHERE parent = [entry] GROUP BY parent
    )   _json_sub
  FROM token
  LIMIT 10
  `
      )
      .all().map((r) => {
        const out = {}
        let m: RegExpExecArray | null
        for (const [k, v] of Object.entries(r)) {
          if (v === null) {
            continue
          }

          if (m = /^_json_(.+)$/.exec(k)) {
            out[m[1]] = JSON.parse(v)
          } else if (m = /^_date_(.+)$/.exec(k)) {
            out[m[1]] = new Date(v)
          } else {
            out[k] = v
          }
        }

        return out
      })
```

## Thoughts on CASCADE / Trigger

It's not a must. It's not even always recommended.

However, you should monitor / clean your database regularly.
