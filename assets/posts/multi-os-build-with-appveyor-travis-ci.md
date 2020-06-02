---
title: Multi-OS build with Appveyor and Travis CI
category: blog
date: '2020-05-13 00:00 +07:00'
tag:
  - appveyor
  - ci
  - desktop
  - dev.to
  - electron
  - javascript
  - os
  - python
  - travis
---

And it also allows C compiling to binary, as long as you can get the right setup.

I use this with Node [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3), where prebuilt binary for Windows is not working (with Electron), and I am running development on MacOS.

```yaml link
description: >-
  Repeat until recall. Aims to be more powerful Anki alternative. -
  patarapolw/rep2recall
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/rep2recall - .travis.yml
language: en
type: object
url: 'https://github.com/patarapolw/rep2recall/blob/master/.travis.yml'
provider: GitHub
```

<!-- excerpt_separator -->

```yaml link
description: >-
  Repeat until recall. Aims to be more powerful Anki alternative. -
  patarapolw/rep2recall
icon: 'https://github.githubassets.com/favicons/favicon.svg'
image: 'https://avatars3.githubusercontent.com/u/21255931?s=100&v=4'
title: patarapolw/rep2recall - appveyor.yml
language: en
type: object
url: 'https://github.com/patarapolw/rep2recall/blob/master/appveyor.yml'
provider: GitHub
```

This is also a possibility with Python `PyInstaller` / `py2exe` / `py2app`, and Golang with cgo.

Not yet sure about packaging Java...
