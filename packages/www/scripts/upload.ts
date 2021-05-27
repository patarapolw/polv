import fs from 'fs'
import path from 'path'

import fg from 'fast-glob'
import yaml from 'js-yaml'

import { SEARCH } from '../server/db/lunr'
import { ITheme, RAW, SEPARATOR, THEME } from '../server/db/raw'
import { MakeHtml } from './make-html'

async function main() {
  const srcPath = (...f: string[]) => path.resolve('../../_post', ...f)

  THEME.set(
    yaml.load(fs.readFileSync(srcPath('../theme.yml'), 'utf-8')) as ITheme
  )

  const files = await fg('**/*.md', {
    cwd: srcPath(),
  })

  const makeHtml = new MakeHtml()
  RAW.data = {}

  for (const f of files) {
    const header = yaml.load(
      fs.readFileSync(srcPath(f), 'utf-8').split(/\n---\n/)[0]!
    ) as Record<string, any> & {
      date?: Date
    }

    if (header.draft) {
      continue
    }

    const { html, text } = await makeHtml.renderFile(srcPath(f))

    RAW.data[f.replace(/\.mdx?$/, '')] = {
      category: header.category || [],
      title: header.title,
      html: html.join(SEPARATOR) + SEPARATOR,
      text: text.join(SEPARATOR) + SEPARATOR,
      image: header.image,
      date: header.date ? header.date.toISOString() : undefined,
      tag: header.tag || [],
    }
  }

  RAW.set(RAW.data)
  SEARCH.set(RAW.data)
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e)
    throw e
  })
}
