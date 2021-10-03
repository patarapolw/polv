---
title: Customizable PDF viewer with self-built PDF.js
date: 2021-10-03T13:00:00+07:00
tag:
  - pdf
  - webdev
---

At first glances, PDF viewer seems to be as easy as opening a PDF URL in an Iframe; however, not only uncustomizable, but also, if some browsers doesn't support PDF browsing, it could be a problem.

A solution to this would be [Mozilla's PDF.js](https://github.com/mozilla/pdf.js). However, the PDF viewer isn't prebuilt for you in [pdf.js-dist](https://github.com/mozilla/pdfjs-dist), only some minimal JavaScript files.

<!-- excerpt -->

## Building PDF.js by yourself

By this way, it will also build the PDF viewer (which is normally used in Mozilla Firefox). You can also customize HTML, CSS and JavaScript.

```sh
git init
npm i gulp-cli
git submodule add https://github.com/mozilla/pdf.js.git
cd pdf.js
npm i

# Edit web/app_options.js (for default PDF); and `web/viewer.html or CSS files (for UI) to your liking

npx gulp generic
cp -r build/generic ../pdf.js-dist
npx http-server dist -o /web/viewer.html
```

## I already built it for you

This is here. Just copy the [`/dist`](https://github.com/patarapolw/pdf.js-viewer/tree/main/dist) folder.

<%- xCard({
  href: 'https://github.com/patarapolw/pdf.js-viewer',
  image: 'https://avatars.githubusercontent.com/u/21255931?s=100&v=4',
  title: 'GitHub - patarapolw/pdf.js-viewer',
  description: "Example of how to build example viewer of Mozilla's PDF.js"
}) %>

## My example project

[This online Lilypond compiler / playground](https://ly.polv.cc) is made using this, using the endpoint `/pdf.js/web/viewer.html?file=<FILEPATH>#pagemode=none`. It's a quick project of mine to compile MIDI and WAV files, and share it.
