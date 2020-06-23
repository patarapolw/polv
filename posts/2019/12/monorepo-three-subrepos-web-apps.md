---
title: Monorepo with three subrepos for web apps
category: blog
date: '2019-12-26 00:00 +07:00'
tag:
  - dev.to
  - typescript
  - webdev
---

I wonder how you usually set frontend repo and web server repo? Separate repo? Single repo with web server as parent?

However, as I have found [Lerna](https://lerna.js.org/) and [Rest.ts / RESTyped](https://github.com/hmil/rest.ts/wiki/Rest.ts-vs-RESTyped), I have starting to adapt *one monorepo with three subrepos* structure...

<!-- excerpt_separator -->

```txt
.
├── lerna.json
├── package.json
└── packages
    ├── api-definition
    │   └── package.json
    ├── server
    │   └── package.json
    └── web
        └── package.json
```

Where `./packages/web/` is created with `@vue/cli`.

As I also use Yarn Workspace, I adapted Lerna to use Yarn Workspace

```javascript
// ./lerna.json
{
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

```javascript
// ./package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

Also, in each folder's `package.json` I use [org-scope](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) with

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

When I run `yarn` or `yarn install` anywhere in the workspace, it will default install to `./node_modules`

Now, I can reference `@org/api-definition` anywhere inside both `./packages/server` and `./packages/web`.

Example and working repo

```pug parsed
a(data-make-html="card" href="https://github.com/patarapolw/web-api-typescript-monorepo")
  | https://github.com/patarapolw/web-api-typescript-monorepo
  pre(data-template style="display: none;").
    image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
    title: patarapolw/web-api-typescript-monorepo
    description: >-
      Web + API + server + TypeScript + ESLint + Yarn monorepo -
      patarapolw/web-api-typescript-monorepo
```

Now, with some questions,

- Is using global `.eslintrc.js` and `.eslintignore` acceptable?
- What about non-Node.js server? How would you set up the repo?
