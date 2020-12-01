---
title: What is a best way to organize Test Suites / Test Cases in JavaScript?
date: 2020-01-05T00:00:00+07:00
tag:
  - javascript
  - testing
  - typescript
---

- Do you put test cases in JSON / YAML or in separate JavaScript files?
- What keys do you put for each cases, such as Name, Assertion, Result?
- Do you print, i.e. `console.log` / `console.dir(..., {depth: null})`, results?
- Do you write "expect to fail" tests?

<!-- excerpt_separator -->

In my [latest project](https://github.com/patarapolw/deepfind), I use ts-mocha.

I put my test cases in JavaScript file, rather than JSON, because I need some special value (`undefined`).

My test cases is an array of `ITestSuite`.

```typescript
interface ITestSuite {
  name: string
  cond: any
  expect: (result: any[]) => boolean
  obj: any
}
```

I `console.log` test results, as well as do automated assert, using standard library `import assert from 'assert'`.

```typescript
import deepfind from '.'
import assert from 'assert'

const testSuite: ITestSuite[] = [
  ...
]

testSuite.forEach((t) => {
  describe(t.name, () => {
    it(t.name, () => {
      const r = deepfind(t.obj, t.cond)
      console.log(r)
      assert(t.expect(r))
    })
  })
})
```

I didn't write "expect to fail" tests, but I did test in semi-production, using real Webpack config.

I also put `yarn test` inside `yarn prebuild`; and I put `yarn build` inside `yarn prepack`.

I also had some experience with testing on Travis CI, but I didn't set it up this nice; which might be nice if I plan to "branch and merge".

See <https://github.com/patarapolw/deepfind/blob/master/packages/deepfind/src/index.spec.ts>

<%- xCard({
  href: 'https://github.com/patarapolw/deepfind/blob/master/packages/deepfind/src/index.spec.ts',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/deepfind',
  description: 'Deep find a primitive, an Array or a plain Object inside an Array or a plain '
    + 'Object, so that you can edit the Object - patarapolw/deepfind'
}) %>
