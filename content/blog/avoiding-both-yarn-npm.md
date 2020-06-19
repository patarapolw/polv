---
title: Avoiding having both `yarn.lock` and `package-lock.json`
date: '2020-04-16 00:00 +07:00'
tag:
  - dev.to
  - node.js
---

This is possible with pre-install script to check for `yarn.lock` and `package.json`.

The closest I can find for this is,

```yaml link
description: Check if your code is running as an npm or yarn script - sindresorhus/is-npm
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/170270?s=100&v=4'
title: sindresorhus/is-npm
language: en
type: object
url: 'https://github.com/sindresorhus/is-npm'
provider: GitHub
```

Now, I did [ask the author to make CLI](https://github.com/sindresorhus/is-npm/issues/11) for me, but he didn't do exactly what I needed, so I made one myself.

```yaml link
description: >-
  CLI to check NPM or Yarn if specified, or look for package-lock.json or
  yarn.lock - patarapolw/check-npm-yarn
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/check-npm-yarn
language: en
type: object
url: 'https://github.com/patarapolw/check-npm-yarn'
provider: GitHub
```

<!-- excerpt_separator -->

Now, there is still an extra step. `"preinstall": "npx check-npm-yarn"` alone might not be enough. To avoid `npx` and installing every time, I make it,

```json
{
  "scripts": {
    "preinstall": "if command -v check-npm-yarn > /dev/null; then check-npm-yarn; fi"
  }
}
```

## An issue with NPM -- [preinstall npm hook doesn’t execute when installing a specific package](https://npm.community/t/preinstall-npm-hook-doesnt-execute-when-installing-a-specific-package/2505)

I created `nsi` script for this.

```sh
nsi packageA packageB packageC ...
// Or nsi packageA packageB packageC ... --dev
```

## Related Topic

```yaml link
description: >-
  For some differences I have found,  Pro-Yarn   Work better with Nuxt
  TypeScript -- Not sure if this i...
icon: >-
  https://res.cloudinary.com/practicaldev/image/fetch/c_scale,fl_progressive,q_auto,w_192/f_auto/https://practicaldev-herokuapp-com.freetls.fastly.net/assets/devlogo-pwa-512.png
image: 'https://dev.to/social_previews/article/280617.png'
keywords:
  - javascript
  - node
  - discuss
  - software
  - coding
  - development
  - engineering
  - inclusive
  - community
title: Do you have a strong reason to use NPM or Yarn (or something else)?
language: en
type: article
url: >-
  https://dev.to/patarapolw/do-you-have-a-strong-reason-to-use-npm-or-yarn-or-something-else-3pbm
provider: DEV Community
```
