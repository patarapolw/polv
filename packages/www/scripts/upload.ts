import fs from 'fs'
import path from 'path'

import fg from 'fast-glob'
import yaml from 'js-yaml'

import {
  EntryModel,
  ITheme,
  SEPARATOR,
  UserModel,
  mongooseConnect,
} from '../server/db/mongo'
import { MakeHtml } from './make-html'

async function main() {
  const client = await mongooseConnect()

  const srcPath = (...f: string[]) => path.resolve('../../_post', ...f)

  await UserModel.updateOne(
    {},
    {
      $set: {
        theme: yaml.load(
          fs.readFileSync(srcPath('../theme.yml'), 'utf-8')
        ) as ITheme,
      },
    },
    { upsert: true }
  )

  const files = await fg('**/*.md', {
    cwd: srcPath(),
  })

  const makeHtml = new MakeHtml()

  await EntryModel.bulkWrite(
    await Promise.all(
      files.map(async (f) => {
        const header = yaml.load(
          fs.readFileSync(srcPath(f), 'utf-8').split(/\n---\n/)[0]!
        ) as Record<string, any> & {
          date?: Date
        }

        const { html, text } = await makeHtml.renderFile(srcPath(f))

        const p = {
          ...header,
          path: f.replace(/\.mdx?$/, ''),
          html: html.join(SEPARATOR) + SEPARATOR,
          text: text.join(SEPARATOR) + SEPARATOR,
        }

        return {
          updateOne: {
            filter: { path: p.path },
            update: { $set: p },
            upsert: true,
          },
        }
      })
    )
  )

  await client.disconnect()
}

if (require.main === module) {
  main()
}
