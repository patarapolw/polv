import fs from 'fs'
import path from 'path'

import fg from 'fast-glob'
import yaml from 'js-yaml'

import { ITheme, SEPARATOR } from '../src/db'
import { db } from '../src/db/sqlite'
import { MakeHtml } from './make-html'

async function main() {
  const srcPath = (...f: string[]) => path.resolve('../../_post', ...f)

  db.prepare(
    /* sql */ `
  INSERT INTO user (theme)
  VALUES (@theme)
  ON CONFLICT (id) DO UPDATE SET theme = @theme;
  `
  ).run({
    theme: JSON.stringify(
      yaml.load(fs.readFileSync(srcPath('../theme.yml'), 'utf-8')) as ITheme
    ),
  })

  const files = await fg('**/*.md', {
    cwd: srcPath(),
  })

  const makeHtml = new MakeHtml()

  for (const f of files) {
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
      image: header['image'] || null,
      date: header.date ? +header.date : null,
      tag: header['tag'] ? header['tag'].join(' ') : '',
    }

    const r = db
      .prepare(
        /* sql */ `
    UPDATE "entry"
    SET
      title = @title,
      "image" = @image,
      "date" = @date,
      tag = @tag,
      "text" = @text,
      html = @html
    WHERE "path" = @path;
    `
      )
      .run(p)

    if (!r.changes) {
      db.prepare(
        /* sql */ `
      INSERT INTO "entry" ("path", title, "image", "date", tag, "text", html)
      SELECT @path, @title, @image, @date, @tag, @text, @html
      WHERE (SELECT changes() = 0);
      `
      ).run(p)
    }
  }

  db.close()
}

if (require.main === module) {
  main()
}
