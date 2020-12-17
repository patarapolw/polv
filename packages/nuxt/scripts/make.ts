import fg from 'fast-glob'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import lunr from 'lunr'
import rimraf from 'rimraf'

import { IPostSerialized, zMatter } from '../server/db'
import { buildPath, dstMediaPath } from '../server/dir'
import { THEME_FILENAME } from '../server/theme'
import { srcPath } from './dir'
import { MakeHtml } from './make-html'

async function main() {
  rimraf.sync(dstMediaPath())
  rimraf.sync(buildPath())

  await fs.copy(srcPath('_media'), dstMediaPath())
  await fs.ensureDir(buildPath())

  await fs.copyFile(srcPath(THEME_FILENAME), buildPath(THEME_FILENAME))

  const files = await fg('**/*.md', {
    cwd: srcPath('_post'),
  })

  const makeHtml = new MakeHtml()
  const rawJson: IPostSerialized[] = []

  await Promise.all(
    files.map(async (f) => {
      const header = zMatter.parse(
        yaml.safeLoad(
          fs.readFileSync(srcPath('_post', f), 'utf-8').split(/\n---\n/)[0]
        )
      )

      const { excerptHtml, contentHtml, content } = await makeHtml.renderFile(
        srcPath('_post', f)
      )

      const p: IPostSerialized = {
        ...header,
        date: header.date ? header.date.getTime() : undefined,
        createdAt: header.createdAt ? header.createdAt.getTime() : undefined,
        updatedAt: header.updatedAt ? header.updatedAt.getTime() : undefined,
        path: f.replace(/\.mdx?$/, ''),
        excerptHtml,
        contentHtml,
        content,
      }

      rawJson.push(p)
    })
  )

  fs.writeFileSync(
    buildPath('raw.json'),
    JSON.stringify(
      rawJson.reduce(
        (prev, { path, ...p }) => ({ ...prev, [path]: { path, ...p } }),
        {}
      )
    )
  )
  fs.writeFileSync(
    buildPath('idx.json'),
    JSON.stringify(
      lunr(function () {
        this.ref('path')
        this.field('title', { boost: 5 })
        this.field('tag', { boost: 5 })
        this.field('category', { boost: 5 })
        this.field('content')

        rawJson.map((doc) => {
          return this.add(doc)
        })
      })
    )
  )
  fs.writeFileSync(
    buildPath('tag.json'),
    JSON.stringify(
      rawJson.reduce((prev, { tag = [] }) => {
        const ts: string[] = tag

        // eslint-disable-next-line array-callback-return
        ts.map((t) => {
          prev[t] = (prev[t] || 0) + 1
        })

        return prev
      }, {} as Record<string, number>)
    )
  )
}

if (require.main === module) {
  main()
}
