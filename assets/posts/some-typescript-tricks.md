---
title: Some TypeScript tricks
date: '2020-04-23 00:00 +07:00'
tag:
  - dev.to
  - typescript
---

This might not be something so special, but I bet not everyone knows.

## Running `*.ts` files directly

Use [ts-node](https://www.npmjs.com/package/ts-node) instead of `node`, and [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) instead of `nodemon`.

Cannot run `ts-node` due to `import` syntaxes? No problemo, try this

```sh
ts-node -O '{"module": "commonjs"}' scripts/example.ts
```

I do not recommend you use `ts-node` in production.

<!-- excerpt_separator -->

## `tsconfig.json`, linting, declaration map and more

You should create `tsconfig.json` with `tsc --init`.

After that, you should see

```js
{
  "compilerOptions": {
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

Different settings are for Web browsers and Node.js

For web browsers,

```js
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

For Node.js,

```js
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    "outDir": "./lib",
    "rootDir": "./src"
  }
}
```

For linting,

- Some ESLint rules are quite problematic. You should use `tsconfig.json`'s instead.

```js
// .eslintrc.js

{
  rules: {
    'no-unused-vars': 0,
    'no-useless-constructor': 0
  }
}
```

```js
// tsconfig.json

{
  "compilerOptions": {
    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    "strictNullChecks": true,              /* Enable strict null checks. */
    "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    "noUnusedLocals": true,                /* Report errors on unused locals. */
    "noUnusedParameters": true,            /* Report errors on unused parameters. */
    "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Advanced Options */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

BTW, I currently recommend this `.eslintignore`.

```ignore
*.*
!*.ts
!*.js
!*.tsx
!*.jsx
!*.vue
node_modules
dist
```

## Compiling TypeScript to JavaScript

Other than using Rollup, Webpack, Parcel or something else, you can also just run,

```sh
tsc
```

For web browsers, if you enable `"module": "esnext"` in `tsconfig.json`, you can relative import as well, using `<script type="module">`, although you will need to go extra mile, as this is not Babel.

```yaml link
description: >-
  But it is slightly harder for TypeScript's tsc.  Actually, the real problem
  here is loading other Jav...
icon: >-
  https://res.cloudinary.com/practicaldev/image/fetch/c_scale,fl_progressive,q_auto,w_192/f_auto/https://practicaldev-herokuapp-com.freetls.fastly.net/assets/devlogo-pwa-512.png
image: 'https://dev.to/social_previews/article/264551.png'
keywords:
  - javascript
  - typescript
  - node
  - webdev
  - software
  - coding
  - development
  - engineering
  - inclusive
  - community
title: Laziest way to publish for both NPM and <script src="">
language: en
type: article
url: >-
  https://dev.to/patarapolw/laziest-way-to-publish-for-both-npm-and-script-src-4859
provider: DEV Community
```

Or, just use Snowpack.
