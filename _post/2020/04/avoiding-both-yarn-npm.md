---
title: Avoiding having both `yarn.lock` and `package-lock.json`
date: '2020-04-16 00:00 +07:00'
tag:
  - dev.to
  - node.js
---

This is possible with pre-install script to check for `yarn.lock` and `package.json`.

The closest I can find for this is,

<%- xCard({
  href: 'https://github.com/sindresorhus/is-npm',
  image: 'https://avatars3.githubusercontent.com/u/170270?s=400&v=4',
  title: 'sindresorhus/is-npm',
  description: 'Check if your code is running as an npm or yarn script - sindresorhus/is-npm'
}) %>

Now, I did [ask the author to make CLI](https://github.com/sindresorhus/is-npm/issues/11) for me, but he didn't do exactly what I needed, so I made one myself.

<%- xCard({
  href: 'https://github.com/patarapolw/check-npm-yarn',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/check-npm-yarn',
  description: 'CLI to check NPM or Yarn if specified, or look for package-lock.json or '
    + 'yarn.lock - patarapolw/check-npm-yarn'
}) %>

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

<%- xCard({
  href: 'https://dev.to/patarapolw/do-you-have-a-strong-reason-to-use-npm-or-yarn-or-something-else-3pbm',
  image: 'https://dev.to/social_previews/article/280617.png',
  title: 'Do you have a strong reason to use NPM or Yarn (or something else)?',
  description: 'For some differences I have found,  Pro-Yarn   Work better with Nuxt '
    + 'TypeScript -- Not sure if this i...'
}) %>
