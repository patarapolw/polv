---
title: Deno might not kill Node, but something else
date: 2020-10-02
tag:
  - deno
  - javascript
  - typescript
---

Due to vast popularity of **NOT** Node.js, but JavaScript itself, and web browsers, I see Deno as a scripting language platform for JavaScript and WASM. It also supports [JSDOM](https://github.com/denoland/deno_std/pull/542), therefore all web browser methods.

It makes JavaScript and WASM comparable to JVM bytecode; but rather for dynamic typing.

<!-- excerpt -->

It is also comparable to Java's [JBang](https://jbang.dev/), but I don't see JBang as getting very popular.

Of course, you can also use [Python](https://docs.python.org/3/distutils/setupscript.html#installing-scripts) for this as well.

Surprisingly, [Golang](https://gist.github.com/posener/73ffd326d88483df6b1cb66e8ed1e0bd) or [Kotlin](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md) is just not yet ready for scripting with heavy external dependencies.

Node.js might not be good enough for scripting, because

- `/package.json` and `/node_modules` are required. You cannot simply use global filesystem's.
- `eslint`, and probably also `prettier` and `typescript`, are often recommendly installed. You don't need these in Deno.
- Javascript packages with **only JSDoc**, [no .d.ts](https://dev.to/patarapolw/comment/15e1h), when you already use TypeScript.

In short, I will kill other **scripting** languages.

## It probably cannot kill Node.js

It cannot replace Node mainly because it can only replace frontend libraries just as fast as other non-Node.js frontend libs. (Such as Golang's [esbuild](https://github.com/evanw/esbuild), and the associated [Hugo](https://dev.to/teamallnighter/how-to-add-custom-javascript-to-hugo-54p2).)

Node.js is just too popular. And [Deno is not yet ready for front-end compilers](https://www.reddit.com/r/Deno/comments/gyip0q/cmv_deno_is_unusable_for_webapps/).

```js
// This is a false comparison.
'node'.split('').sort().join('')
```
