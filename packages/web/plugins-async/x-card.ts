const template = document.createElement('template')
template.innerHTML = /* html */ `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css">

<style>
::-webkit-scrollbar {
  width: 0 !important;
}

* {
  font-family: sans-serif;
  -ms-overflow-style: none;
}

:host > a {
  text-decoration: none;
  display: flex;
  flex-direction: row;
  max-width: 600px;
  margin: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.figure {
  display: none; /* flex */
  margin-right: 1rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100px;
  min-width: 100px;
}

article {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

article > * {
  min-width: 200px;
}

img {
  height: auto;
  width: 100px;
}

.header {
  color: #2b6cb0;
  margin-block-start: 0;
  margin-bottom: 0;
  font-size: 1.3rem;
  font-weight: bold;
  padding-bottom: 1rem;
  max-height: 10em;
  overflow: scroll;
}

.description {
  display: none; /* block */
  min-height: 4em;
  max-height: 10em;
  overflow: scroll;
}
</style>

<div class="figure">
  <img />
</div>
<article>
  <div class="header"></div>
  <div class="description"></div>
</article>
`

class XCard extends HTMLElement {
  async connectedCallback() {
    // Await a little for incremental dom to load
    await new Promise((resolve) => setTimeout(resolve, 50))

    const aEl = this.querySelector('a')!.cloneNode(true) as HTMLAnchorElement
    if (aEl && aEl.textContent) {
      const href = this.getAttribute('href')
      const image = this.getAttribute('image')
      const mediaId = this.getAttribute('media-id')
      const title = this.getAttribute('title')
      const description = this.getAttribute('description')

      aEl.target = '_blank'
      aEl.href = href!
      aEl.rel = 'noopener nofollow'
      aEl.textContent = ''
      aEl.appendChild(template.content.cloneNode(true))

      const shadow = this.attachShadow({ mode: 'open' })

      if (mediaId || image) {
        ;(aEl.querySelector('.figure') as HTMLDivElement).style.display = 'flex'

        const imgEl = aEl.querySelector('img') as HTMLImageElement
        imgEl.setAttribute(
          'data-download',
          JSON.stringify({
            maxWidth: 100,
          })
        )

        Object.assign(imgEl, {
          src: mediaId ? `/media/${mediaId}.png` : image,
          alt: title || href,
        })
      }

      ;(aEl.querySelector('.header') as HTMLDivElement).textContent =
        title || href!

      if (description) {
        const descEl = aEl.querySelector('.description') as HTMLDivElement
        descEl.textContent = description
        descEl.style.display = 'block'
      }

      shadow.appendChild(aEl)
    }
  }
}

customElements.define('x-card', XCard)
