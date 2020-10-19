---
title: I turned my website into a template, mostly by git tricks
date: 2020-06-20
tag:
  - nuxt
  - git
  - vue
  - dev.to
  - pinned
---

This was created by

- Move personalized information from every folders to some very specific folders

```sh
/media/
/post/**/*.md
/theme.yml
```

- Separate to two repos, of theme, and of content

```sh
# Shared commands
brew install git-filter-repo # https://github.com/newren/git-filter-repo/blob/main/INSTALL.md
```

<!-- excerpt -->

```sh
# Content repo
git remote add upstream <GIT_UPSTREAM_URL>
git fetch upstream
git pull upstream master
git remote remove upstream
git filter-repo --path 'blog/**/*.md' --path 'media/' --path theme.yml --force # and other related content folders in the past
git push origin master
```

```sh
# Theme repo
git remote add upstream <GIT_UPSTREAM_URL>
git fetch upstream
git pull upstream master
git remote remove upstream
git filter-repo --invert-paths --path 'blog/**/*.md' --path 'media/' --path theme.yml --force # and other related content folders in the past
echo '/content/' >> .gitignore
git push origin master
```

- Then, add `environmental variables` to Netlify as needed. After, if you working repo git is connected to Netlify

```sh
# Working repo
git remote add upstream <GIT_THEME_URL>
git fetch upstream
git switch -c dev upstream/master
git clone <GIT_CONTENT_URL> content
git push origin dev
git branch -D master
git checkout master
git push -f origin master
```

I also summarized this on GitHub's wiki.

```pug parsed
a(data-make-html="card" href="https://github.com/patarapolw/nuxt-blog-template")
  | https://github.com/patarapolw/nuxt-blog-template
  pre(data-template style="display: none;").
    image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
    title: patarapolw/nuxt-blog-template
    description: >-
      Nuxt.js blog template, with working version at https://www.polv.cc -
      patarapolw/nuxt-blog-template
```

Of course, this is used in a real website -- https://www.polv.cc and the lighthouse score (https://web.dev/measure/) is quite commendable, I think; although there are indeed [rooms to improve](https://github.com/patarapolw/nuxt-blog-template/issues/5).

[![Lighthouse score](https://user-images.githubusercontent.com/21255931/85204182-d91a2380-b33c-11ea-8a82-74b857868d03.png)](https://github.com/patarapolw/nuxt-blog-template/issues/6)
