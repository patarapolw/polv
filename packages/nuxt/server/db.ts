import sqlite3 from 'better-sqlite3'
import * as z from 'zod'

import { builtPath } from './dir'

const zMatter = z.object({
  date: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  priority: z.number().optional(),
  title: z.string(),
  image: z.string().optional(),
  tag: z.array(z.string()).optional(),
  category: z.string().optional(),
})

export type IMatter = z.infer<typeof zMatter>

export const zPost = z
  .object({
    path: z.string(),
    /**
     * Cleaned and jieba-separated markdown
     */
    content: z.string(),
    excerptHtml: z.string(),
    contentHtml: z.string(),
  })
  .merge(zMatter.nonstrict())

export type IPost = z.infer<typeof zPost>

export class Database {
  db: sqlite3.Database

  constructor(opts?: sqlite3.Options) {
    this.db = sqlite3(builtPath('data.db'), opts)
  }

  public init(): void {
    this.db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS files (
      [path]        TEXT PRIMARY KEY,
      [date]        INT,    -- epoch milli
      createdAt     INT,    -- epoch milli
      updatedAt     INT,    -- epoch milli
      priority      INT,
      -- q.title
      [image]       TEXT,
      -- m2o files_tag
      -- q.category
      -- q.content
      excerptHtml   TEXT NOT NULL,
      contentHtml   TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS files_date ON files([date]);
    CREATE INDEX IF NOT EXISTS files_createdAt ON files(createdAt);
    CREATE INDEX IF NOT EXISTS files_updatedAt ON files(updatedAt);
    CREATE INDEX IF NOT EXISTS files_priority ON files(priority);

    CREATE TABLE IF NOT EXISTS files_tag (
      [path]        TEXT NOT NULL,
      tag           TEXT NOT NULL,
      PRIMARY KEY ([path], tag)
    );
    `)

    this.db.exec(/* sql */ `
    CREATE VIRTUAL TABLE IF NOT EXISTS q USING fts5 (
      [path],       -- REFERENCES files([path])
      title,
      tag,          -- space separated
      category,     -- can compare via equal
      content       -- cleaned markdown
    );
    `)
  }

  public insert(...ps: IPost[]): void {
    const fStmt = this.db.prepare(/* sql */ `
    INSERT INTO files ([path], [date], [createdAt], [updatedAt], priority, [image], excerptHtml, contentHtml)
    VALUES (@path, @date, @createdAt, @updatedAt, @priority, @image, @excerptHtml, @contentHtml)
    `)

    const ftStmt = this.db.prepare(/* sql */ `
    INSERT INTO files_tag ([path], tag)
    VALUES (@path, @tag)
    `)

    const qStmt = this.db.prepare(/* sql */ `
    INSERT INTO q ([path], title, tag, category, content)
    VALUES (@path, @title, @tag, @category, @content)
    `)

    this.db.transaction(() => {
      // eslint-disable-next-line array-callback-return
      ps.map((p) => {
        const {
          path,
          date,
          createdAt,
          updatedAt,
          priority,
          image,
          excerptHtml,
          contentHtml,
          title,
          tag,
          category,
          content,
        } = zPost.parse(p)

        fStmt.run({
          path,
          priority,
          image,
          excerptHtml,
          contentHtml,
          date: date ? date.getTime() : null,
          createdAt: createdAt ? createdAt.getTime() : null,
          updatedAt: updatedAt ? updatedAt.getTime() : null,
        })

        qStmt.run({
          path,
          title,
          category,
          content,
          tag: tag ? tag.join(' ') : undefined,
        })

        if (tag) {
          Array.from(new Set(tag)).map((t) => {
            ftStmt.run({
              path,
              tag: t,
            })
          })
        }
      })
    })()
  }

  public get(id: string) {
    const r = this.db
      .prepare(
        /* sql */ `
    SELECT
      [date],
      title,
      [image],
      GROUP_CONCAT(ft.tag, ' ')   tag,
      category,
      contentHtml   content
    FROM files f
    JOIN      q             ON q.path = f.path
    LEFT JOIN files_tag ft  ON ft.path = f.path
    WHERE f.path = @id
    GROUP BY f.path
    `
      )
      .get({ id })

    if (!r) {
      return null
    }

    return {
      ...r,
      date: r.date ? new Date(r.date) : undefined,
      tag: r.tag ? r.tag.split(/ /g) : undefined,
    } as {
      date?: Date
      title: string
      image?: string
      tag?: string[]
      category?: string
      content: string
    }
  }

  public q(
    q: string,
    opts: {
      offset: number
      limit: number
      tag?: string
    }
  ) {
    return this._search(q, {
      ...opts,
      orderedBy: 'RANK',
    })
  }

  public by(opts: { tag?: string; offset: number; limit: number }) {
    return this._search('', {
      ...opts,
      orderedBy: 'priority DESC, [date] DESC, createdAt DESC, updatedAt DESC',
      where: ['[date] IS NOT NULL'],
    })
  }

  private _search(
    q: string,
    opts: {
      offset: number
      limit: number
      orderedBy: string
      tag?: string
      where?: string[]
    }
  ) {
    const $where: string[] = []
    if (q) {
      $where.push('q = @q')
    }

    if (opts.tag) {
      $where.push('ft.tag = @tag')
    }

    if (opts.where) {
      $where.push(...opts.where)
    }

    const fromSegment = /* sql */ `
    FROM files f
    JOIN q ON q.path = f.path
    ${opts.tag ? `LEFT JOIN files_tag ft ON ft.path = f.path` : ''}
    WHERE ${$where.join(' AND ') || 'TRUE'}
    ${opts.tag ? 'GROUP BY f.path' : ''}
    `

    const cond = {
      q,
      tag: opts.tag,
    }

    const count =
      this.db
        .prepare(
          /* sql */ `
    SELECT COUNT(f.path) [count]
    ${fromSegment}
    `
        )
        .get(cond)?.count || 0

    const result = this.db
      .prepare(
        /* sql */ `
    SELECT
      f.path    [path],
      [date],
      title,
      [image],
      category,
      excerptHtml   excerpt
    ${fromSegment}
    ORDER BY ${opts.orderedBy}
    LIMIT ${opts.limit} OFFSET ${opts.offset}
    `
      )
      .all(cond) as {
      path: string
      date?: Date
      title: string
      image?: string
      category?: string
      excerpt: string
    }[]

    return {
      result,
      count,
    }
  }
}
