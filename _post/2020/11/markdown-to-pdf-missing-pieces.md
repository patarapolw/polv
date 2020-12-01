---
title: 'Markdown to PDF: missing pieces from various approaches, and beyond HTML'
date: 2020-11-04T00:00:00+07:00
tag:
  - markdown
  - pdf
  - latex
  - vscode
category:
  - pinned
---

Let me say this first, the best way to create PDF from markdown is via web technology (Chrome / Puppeteer), because it is the closest to WSYIWYG (What You See Is What You Get), but it is not perfect.

It currently misses at least one PDF specific features (and possibly more) - Table of Contents / Bookmarks.

<%- xCard({
  href: 'https://github.com/puppeteer/puppeteer/issues/1778',
  image: 'https://avatars2.githubusercontent.com/u/6906516?s=400&amp;v=4',
  title: 'feature request: add option to generate TOC for pdf output · Issue #1778 · puppeteer/puppeteer',
  description: 'Since now headers and footers with page numbers work, I now desperately miss an option to generate a Table of Contents (TOC) out of the h1- h7 headers when generating a pdf file (i.e like wkhtmltop...'
}) %>

And one of the best tools to create PDF is Visual Studio Code, if you know how to use [Markdown Preview Enhanced](https://github.com/shd101wyy/markdown-preview-enhanced) properly. (I've just noticed that I can use this in Atom as well.)

<%- xCard({
  href: 'https://github.com/shd101wyy/markdown-preview-enhanced',
  image: 'https://avatars2.githubusercontent.com/u/1908863?s=400&amp;v=4',
  title: 'shd101wyy/markdown-preview-enhanced',
  description: "One of the 'BEST' markdown preview extensions for Atom editor! - shd101wyy/markdown-preview-enhanced"
}) %>

<!-- excerpt -->

The trick is, when previewing Markdown, right click on the Preview space to see

- `Open in Browser`, to tweak using `Inspect Element`
- `Chrome (Puppeteer) >> PDF`, for shortcut to export to PDF. (You will also need [Puppeteer](https://github.com/puppeteer/puppeteer/))

![MPE contextmenu](https://dev-to-uploads.s3.amazonaws.com/i/vp0b48o0voepinc4c2sl.jpg)

## You can use custom CSS's.

Indeed, some CSS's are specific to printing, and you can customize that for Markdown Preview Enhanced (MPE).

I current recommend this [LESS](http://lesscss.org/).

```less
html, body {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

.markdown-preview {
  box-sizing: border-box;
  position: relative;

  @media print, screen {
    section {
      display: flex;
      flex-direction: column;

      &[vertical-center] {
        min-height: 100%;
        justify-content: center;
      }

      &[horizontal-center] {
        align-items: center;
        text-align: center;
      }
    }

    section + *, h1 {
      page-break-before: always;
    }

    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }

    article {
      page-break-inside: avoid;
    }
  }
}
```

Also, you can [import your own LESS](https://shd101wyy.github.io/markdown-preview-enhanced/#/customize-css?id=local-style).

[Importing other file types](https://shd101wyy.github.io/markdown-preview-enhanced/#/file-imports) is also possible.

## Markdown inside HTML, in order to use CSS

This is possible natively with Markdown-it, by leaving at least two new lines after the opening div.

```markdown
<div class="center">

## Hello World

</div>
```

## Customizing Puppeteer, with YAML frontmatter

<https://shd101wyy.github.io/markdown-preview-enhanced/#/puppeteer?id=configure-puppeteer>

So, I made it like this.

```yaml
---
id: print
class: 'title'
puppeteer:
  margin:
    top:    2cm
    bottom: 2cm
    left:   2cm
    right:  2cm
---

@import "/_styles/print.less"
```

## Going beyond HTML

Actually, I have already figured ways to go beyond HTML, including

- Extending Markdown with template engines. [EJS](https://ejs.co/) has nice syntax-highlighting inside Markdown in VSCode
- Non-Markdown/HTML - LaTeX or ConTeXt - via pandoc, or natively
- PDF manipulation libraries. Some of my recommendations are
  - [pdfbox](https://pdfbox.apache.org/) - Java; can also run without JDK via `java -jar pdfbox-app-2.y.z.jar`
  - [pdf-lib](https://github.com/Hopding/pdf-lib) - Node.js
  - [PyPDF2](https://pythonhosted.org/PyPDF2/) - Python (there seems to be up to [PyPDF4](https://github.com/claird/PyPDF4), now)
