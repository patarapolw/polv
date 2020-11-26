---
title: Don't Promise.all() everything at once
date: 2020-11-26
tag:
  - javascript
  - async
---

In short, don't execute thousands of Promises at once. Please either,

- Do in batch
- Keep space between ones

And this applies not only to JavaScript, but also anything that are parallel, or parallel-like in nature, including Threads.

<!-- excerpt -->

Don't just do this. You will either break your own API, or get blocked.

```ts
// const vocabs = fs.readFileSync('vocabs.txt', 'utf-8').trim().split(/\n/g)
// console.log(vocab.length) //=> 100,000
//
// const resultMap = new Map<string, Result>()
// const lookup: (v: string) => Promise<Result> = (v) => fetch(`/api?q=${encodeURIComponent(v)}`)
//   .then((r) => r.json())
//   .then((r) => resultMap.set(v, r))

await Promise.all(vocabs.map((v) => lookup(v)))
```

## Batching

```ts
const promises = vocabs.map((v) => () => lookup(v))

const batchSize = 100
for (let i = 0; i < promises.length; i += batchSize) {
  await Promise.all(promises.slice(i, i + batchSize).map((p) => p()))
}
```

## Keeping the space in-between

```ts
const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec))

await Promise.all(
  vocabs.map((v, i) => sleep(50 * i).then(() => lookup(v)))
)
```
