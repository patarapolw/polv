import fg from 'fast-glob'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import rimraf from 'rimraf'

import { Database, IMatter } from '../server/db'
import { builtPath, dstMediaPath } from '../server/dir'
import { THEME_FILENAME } from '../server/theme'
import { srcPath } from './dir'
import { MakeHTML } from './make-html'

async function main() {
  rimraf.sync(dstMediaPath())
  rimraf.sync(builtPath())

  await fs.copy(srcPath('_media'), dstMediaPath())
  await fs.ensureDir(builtPath())

  await fs.copyFile(srcPath(THEME_FILENAME), builtPath(THEME_FILENAME))

  const db = new Database()
  db.init()

  const files = await fg('**/*.md', {
    cwd: srcPath('_post'),
  })

  const makeHtml = new MakeHTML()

  await Promise.all(
    files.map(async (f) => {
      const path = f.replace(/\.md$/, '')
      const markdown = fs.readFileSync(srcPath('_post', f), 'utf8')

      const [h] = markdown.substr(4).split(/---\n(.*)$/s)
      const header = yaml.safeLoad(h) as IMatter

      const r = await makeHtml.parse(srcPath('_post', f))
      const contentHtml = r.html()
      const excerptHtml = contentHtml.split(
        /<!-- excerpt(?:_separator)? -->/
      )[0]

      db.insert({
        ...header,
        path,
        content: r.clean(),
        excerptHtml,
        contentHtml,
      })
    })
  )
}

if (require.main === module) {
  main()
}
