---
title: How can I learn to like Golang? (and use it a lot)
tag:
  - dev.to
  - golang
date: '2020-05-30 00:00 +07:00'
---

Well, I did complain, in order to change my point-of-view,

<!-- excerpt_separator -->

I don't Golang because,

- I cannot set `nil` a variable (unless it is a pointer, but not sure if it is recommended to do so?)
- GoDoc is restricted to `//` and isn't Markdown friendly. `gofmt` doesn't recognize `/** */`.
  - Actually, VSCode formatter can give colors to JavaDoc/JSDoc styled `/** */` as well.
- Centralized `~/go/pkg/packages/github.com/<NAME>/<PROJECT>` structure, instead of my custom `~/projects/<PROJECT>` structure
  - Actually, sometimes it is a monorepo, so `~/projects/<PROJECT>/packages/backend`
- Golang maker don't like vendorizing, like what `node_modules` do.
  - What do you recommend? [`go mod` or `dep`?](https://www.activestate.com/blog/golang-module-vs-dep-pros-cons/)

Rust's Cargo seems to be more happy with me, but it is a different language.

The response for the community is quite helpful.

```pug parsed
a(data-make-html="card" href="https://dev.to/patarapolw/how-can-i-learn-to-like-golang-and-use-it-a-lot-38dj")
  | https://dev.to/patarapolw/how-can-i-learn-to-like-golang-and-use-it-a-lot-38dj
  pre(data-template style="display: none;").
    image: 'https://dev.to/social_previews/article/346560.png'
    title: How can I learn to like Golang? (and use it a lot)
    description: >-
      I don't Golang because,   I cannot set nil a variable (unless it is a pointer,
      but not sure if it is...
```
