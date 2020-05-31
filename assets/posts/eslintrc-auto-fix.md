---
title: 'Share your .eslintrc, auto-fix on save, and related config files'
date: '2020-01-07 00:00 +07:00'
tag:
  - dev.to
  - javascript
  - linting
  - typescript
  - vscode
---

Do you know that Visual Studio Code itself can auto-fix your code on save, to be compatible with linting rules.

Currently, I auto-fixes TypeScript, JavaScript, Vue, Markdown files.

For TypeScript, JavaScript, Vue; I simply use ESLint (there is TSLint, but it is becoming deprecated). [VSCode ESLint](https://github.com/microsoft/vscode-eslint) might also be required

For Markdown, it is a little different. I use [VSCode MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) to auto-fix on save.

<!-- excerpt_separator -->

Related plugins

- [JSON plugin](https://www.npmjs.com/package/eslint-plugin-json)
- [Import plugin](https://www.npmjs.com/package/eslint-plugin-import)

My files,

```js
// .eslintrc.js

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
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:json/recommended',
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
    'import/no-unresolved': 0,
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
  },
}
```

```ignore
# .eslintignore

*
!*/
!*.js
!*.ts
!*.json
node_modules
dist
umd
.cache
```

```js
// package.json

{
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^2.12.0",
    "@typescript-eslint/parser": "^2.12.0",
    "@vue/eslint-config-standard": "^5.0.1",
    "@vue/eslint-config-typescript": "^5.0.1",
    "eslint": ">=6.2.2",
    "eslint-config-standard": "^14.1.0",
    "eslint-plugin-import": ">=2.18.0",
    "eslint-plugin-json": "^2.0.1",
    "eslint-plugin-node": ">=9.1.0",
    "eslint-plugin-promise": ">=4.2.1",
    "eslint-plugin-standard": ">=4.0.0",
    "eslint-plugin-vue": "^6.0.1",
    "lerna": "^3.19.0",
    "typescript": "^3.7.4",
    "vue-eslint-parser": "^7.0.0"
  },
  "scripts": {
    "lint": "eslint '**'"
  }
}
```

I use Yarn, BTW.

```js
// $HOME/Library/Application Support/Code/User/settings.json
// See [Where is settings JSON in Vscode?](https://code.visualstudio.com/docs/getstarted/settings)

{
    "editor.wordWrap": "on",
    "editor.tabSize": 2,
    "[typescript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "eslint.lintTask.enable": true,
    "eslint.format.enable": true,
    "eslint.packageManager": "yarn",
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
    "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
    "eslint.alwaysShowStatus": true,
    "eslint.validate": [
        "vue",
        "html",
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact"
    ],
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "vetur.useWorkspaceDependencies": true
}
```

Questions

- Is there an auto-fixer / linting for YAML / YAML front matter?
