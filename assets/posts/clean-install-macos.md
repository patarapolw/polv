---
title: macOS clean install and installing necessary dev applications
date: '2019-11-30 00:00 +07:00'
image: >-
  https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS2Up9c7iRc_aIDVfouaC2OAZYiK6o7ZzermxFeFcsqL3OHb_w8
tag:
  - chinese
  - japanese
  - macOS
  - macOS reformat
  - mandarin
slug: clean-install-macos
category: blog
---

[Reformatting macOS](https://www.imore.com/how-to-prepare-mac-for-sale#reformat-your-hard-drive) is quite easy, but let's see what I do next, for my

- Office work
- Dev hobby
- Language learning (Japanese, Chinese)

<!-- excerpt_separator -->

## Office work

- Try my best to find NTFS driver for macOS
- Install Microsoft Office 2016 (Having previous ID is already enough)
- Install [Dropbox](https://www.dropbox.com/install) and [Google Drive](https://www.google.com/drive/download/).
- [Chrome browser](https://www.google.com/chrome/) and/or [Chromium](https://www.chromium.org/getting-involved/download-chromium)
- Enable these feature, which are, for some reasons, disabled by default

![Tap to click](https://res.cloudinary.com/patarapolw/image/upload/v1584629784/blogdown/20200319-2156.png)

- Tap to click

![App expose](https://res.cloudinary.com/patarapolw/image/upload/v1584629809/blogdown/20200319-2156-n851j3tiu1p.png)

- App expose

![Three finger drag](https://res.cloudinary.com/patarapolw/image/upload/v1584629838/blogdown/20200319-2157.png)

- Three finger drag -- This one is a little tricky as it is [hidden in Accessibilities](https://www.makeuseof.com/tag/three-finger-drag-mac/)

![dock-settings](https://res.cloudinary.com/patarapolw/image/upload/v1584629865/blogdown/20200319-2157-fd7tcnt8789.png)

- Tweak Dock Settings. -- These are my settings.

![dock](https://res.cloudinary.com/patarapolw/image/upload/v1584629913/blogdown/20200319-2158-xclpannoefi.png)

- Remove many icons in the dock, and put in necessary ones.

## Dev

- [Homebrew](https://brew.sh/) -- it is needed to install much of dev tools.
- Xcode -- Xcode has needed compilers for macOS, when it also includes IDE. Xcode is shit, in that it might need 20+ GB to run installer, and takes about 15 GB disk space. It is also needed for many dev tools on macOS (the ones that use `xcode-build`).
- Setup Git settings -- <https://help.github.com/en/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address>
- [Node version manager](https://github.com/nvm-sh/nvm)
  - Node.js is a JavaScript runtime outside a browser.
  - I use v10.17.0 to ensure that it is compatible with most CLI and CMS.
  - I use this instead of downloading Node.js from the official website, or installing directly via Homebrew
- [pvenv](https://github.com/pyenv/pyenv)
  - Python is already present on macOS, but it is Python 2. pyenv helps manage Python versions better than the official website itself.
  - Ruby has the [same problems](/post/2019/07/macos-ruby-python). You should look for [rvm](https://rvm.io/) or [rbenv](https://github.com/rbenv/rbenv) if you plan on using Ruby or [install Jekyll](/post/2019/07/github-pages-blog).
- [Visual Studio Code](https://code.visualstudio.com/) and/or [VSCodium](https://github.com/VSCodium/vscodium) -- best editor for TypeScript (and probably JavaScript).
  - I haven't developed much liking to [WebStorm](https://www.jetbrains.com/webstorm/) in order to purchase it. (My impression? -- much similar to VSCode.)
  - I failed to customize [Atom IDE](https://atom.io/) to my liking. I prefer to have both VSCode and VSCodium on my computer instead.
  - [Sublime Text](https://www.sublimetext.com/) might be OK, but I haven't tried it for a while. -- I tend to think that commercial-backed products might be better than free counterparts.
  - I also ditched [TextMate](https://macromates.com/), BTW.
- [Android Studio](https://developer.android.com/studio), first run, and [clone and run a package using NDK](https://github.com/patarapolw/KeePassDX-diceware).
  - I also installed [Flutter via Homebrew](https://github.com/flutter/flutter/issues/14050), to take advantage of [`flutter doctor`](https://flutter.dev/docs/get-started/install/macos#run-flutter-doctor)

## Language learning

- For Chinese (Mandarin) language, I use [Sogou input engine](https://pinyin.sogou.com/mac/).
- For Japanese language, I use [Google input engine](https://www.google.co.jp/ime/).
- For Thai language, I just use macOS's.
