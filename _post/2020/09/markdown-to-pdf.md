---
title: A reliable way to create PDF from HTML/markdown, with PDF specific features
date: 2020-09-29T00:00:00+07:00
tag:
  - markdown
  - pdf
  - writing
---

Indeed, the way includes

- Don't just simply convert a HTML file to PDF, one-to-one. Otherwise, you can never control page breaks.
- Nonetheless, HTML rendering will be web-browser dependent. (Therefore, not sure about [Pandoc](https://pandoc.org/MANUAL.html).)
- CSS is powerful, but are there exceptions?

Therefore, I suggest a way of using a web driver + a PDF library, that can READ and MODIFY pdf.

The web driver is currently best either Puppeteer, or Chrome DevTools Protocol.

<!-- excerpt -->

Additionally, it might be possible to distribute PDF generator via Electron + [Puppeteer-in-Electron](https://www.npmjs.com/package/puppeteer-in-electron).

<%- xCard({
  href: 'https://stackoverflow.com/questions/58213258/how-to-use-puppeteer-core-with-electron',
  image: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded',
  title: 'How to use puppeteer-core with electron?',
  description: 'I got this code from another Stackoverflow Question:'
}) %>

The PDF manager, that can read-and-merge PDF, is traditionally either [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) (binary) or [pdfbox](https://pdfbox.apache.org/) (Java), I think; but I have just recently found,

<%- xCard({
  href: 'https://github.com/Hopding/pdf-lib',
  image: 'https://avatars3.githubusercontent.com/u/10351828?s=400&amp;v=4',
  title: 'Hopding/pdf-lib',
  description: 'Create and modify PDF documents in any JavaScript environment - Hopding/pdf-lib'
}) %>

About CSS, yes CSS can also detect page margins.

```css
  body {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
```

This is my attempt so far.

<%- xCard({
  href: 'https://github.com/patarapolw/make-pdf',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&amp;v=4',
  title: 'patarapolw/make-pdf',
  description: 'Beautifully make a pdf from couples of image files - patarapolw/make-pdf'
}) %>

So, the answer to the question is, no, do not convert a single HTML or Markdown file, to one PDF file; but do combine [within a folder](https://github.com/patarapolw/make-pdf/tree/master/in). Also,

- Running a web server might be better than using `file://` protocol and relative paths
- Choosing a web browser might affect result.

Also, consider alternatives to PDF, that easily allow editing. Might be [odt](https://www.npmjs.com/package/simple-odf) or [docx](https://www.npmjs.com/package/docx)?
