---
title: 'Creating an NPM repo with browser version, and also with testing and linting'
category: blog
date: '2020-01-07 00:00 +07:00'
tag:
  - dev.to
  - javascript
  - testing
  - typescript
slug: npm-repo-with-browser-test-lint
---

This can be done by setting up,

- Multiple `tsconfig.json`
- `/browser.ts` compiled by [Parcel.js](https://parceljs.org/) to `/umd/index.min.js`
- ESLint, with `eslint --init`
- Testing, with `ts-mocha`

So, the project is basically like this,

<!-- excerpt_separator -->

```txt
.
├── .eslintrc.js
├── browser.ts
├── package.json
├── src
│   ├── index.ts
│   └── tsconfig.json
├── tests
│   ├── index.spec.ts
│   ├── index.spec.yaml
│   └── tsconfig.json
└── tsconfig.json
```

The contents of the files are the following,

```js
// /package.json
{
  "files": [
    "dist",
    "umd"
  ],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "prebuild": "yarn test",
    "build": "tsc -p src/tsconfig.json",
    "browserify": "parcel build -d umd -o index.min.js ./browser.ts",
    "test": "ts-mocha --paths -p tests/tsconfig.json tests/**/*.spec.ts",
    "prepack": "yarn build && yarn browserify"
  },
  "devDependencies": {
    "@types/expect": "^24.3.0",
    "@types/js-yaml": "^3.12.1",
    "@types/mocha": "^5.2.7",
    "js-yaml": "^3.13.1",
    "mocha": "^6.0.0",
    "parcel-bundler": "^1.12.4",
    "ts-mocha": "^6.0.0",
    "typescript": "^3.7.4"
  }
}
```

Note that `prepack` means `prepublish`, so every time you publish to NPM, there will be both JS and UMD versions.

```js
// /tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  }
}
```

Not sure if I should also specify `target: "esnext"` and `module: "esnext"` as well?

```js
// /src/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist"
  }
}
```

```js
// /tests/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "../src/*"
      ]
    }
  },
  "include": [
    "../src",
    "../tests"
  ]
}
```

```typescript
// /browser.ts
import { a, b, c } from './src'
Object.assign(window, { a, b, c })
```

Now, when you push to NPM, you can access the browser version via [unpkg](https://unpkg.com/), with the globals, `a`, `b` and `c`.

```txt
unpkg.com/:package@:version/umd/index.min.js
```

What is missing here, is I haven't add `pre-commit` hooks to test and lint before committing, probably via [husky](https://www.npmjs.com/package/husky). Also, the CI, e.g. Travis CI

## Real project

In [my real repo](https://github.com/patarapolw/git-publisher), it's actually a monorepo (mostly powered by Yarn workspaces), and the following folder structure.

```txt
.
├── data/**/*.*
├── .eslintignore
├── .eslintrc.js
├── lerna.json
├── package.json
├── tsconfig.json
└── packages
    ├── eqdict
    │   ├── browser.ts
    │   ├── package.json
    │   ├── src
    │   │   ├── index.ts
    │   │   └── tsconfig.json
    │   ├── tests
    │   │   ├── index.spec.ts
    │   │   ├── index.spec.yaml
    │   │   └── tsconfig.json
    │   └── tsconfig.json
    ├── hyperpug
    │   ├── browser.ts
    │   ├── package.json
    │   ├── src
    │   │   ├── index.ts
    │   │   └── tsconfig.json
    │   ├── tests
    │   │   ├── index.spec.ts
    │   │   ├── index.spec.yaml
    │   │   ├── sample.html
    │   │   └── tsconfig.json
    │   └── tsconfig.json
    ├── indent-utils
    │   ├── browser.ts
    │   ├── package.json
    │   ├── src
    │   │   ├── index.ts
    │   │   └── tsconfig.json
    │   ├── tests
    │   │   ├── index.spec.ts
    │   │   ├── index.spec.yaml
    │   │   └── tsconfig.json
    │   └── tsconfig.json
    ├── make-html
    │   ├── package.json
    │   ├── src
    │   │   ├── index.ts
    │   │   └── tsconfig.json
    │   ├── tests
    │   │   ├── index.spec.ts
    │   │   └── tsconfig.json
    │   └── tsconfig.json
    └── web
```

In this case, the repo is tested in `/packages/make-html` and `/packages/web`, while querying the data from `/data`.

I also add `.eslintignore` with the following

```ignore
!**/.eslintrc*
node_modules
dist
umd
*.svg
*.ico
*.json
*.md
*.log
*.lock
```

And, my ESLint config, that can properly control my TypeScript.

```js
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 0,
    'no-useless-constructor': 0,
    'no-cond-assign': 0,
    'no-undef': 0,
    'no-new': 0,
    'arrow-parens': ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
      },
    }],
  },
}

```
