---
title: Multi-OS build with Appveyor and Travis CI
date: 2020-05-13T00:00:00+07:00
tag:
  - appveyor
  - ci
  - desktop
  - electron
  - javascript
  - os
  - python
  - travis
---

And it also allows C compiling to binary, as long as you can get the right setup.

I use this with Node [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3), where prebuilt binary for Windows is not working (with Electron), and I am running development on MacOS.

<%- xCard({
  href: 'https://github.com/patarapolw/rep2recall/blob/master/.travis.yml',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/rep2recall - .travis.yml',
  description: 'Repeat until recall. Aims to be more powerful Anki alternative. - '
    + 'patarapolw/rep2recall'
}) %>

<!-- excerpt_separator -->

<%- xCard({
  href: 'https://github.com/patarapolw/rep2recall/blob/master/appveyor.yml',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/rep2recall - appveyor.yml',
  description: 'Repeat until recall. Aims to be more powerful Anki alternative. - '
    + 'patarapolw/rep2recall'
}) %>

This is also a possibility with Python `PyInstaller` / `py2exe` / `py2app`, and Golang with cgo.

Not yet sure about packaging Java...
