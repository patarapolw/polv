import * as z from 'zod'

export const zMatter = z.object({
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
     * Cleaned markdown
     */
    content: z.string(),
    excerptHtml: z.string(),
    contentHtml: z.string(),
  })
  .merge(zMatter.nonstrict())

export type IPost = z.infer<typeof zPost>

export type IPostSerialized = Omit<
  IPost,
  'date' | 'createdAt' | 'updatedAt'
> & {
  date?: number
  createdAt?: number
  updatedAt?: number
}

export interface IPostIndexed {
  path: string
  title: string
  tag?: string[]
  category: string
  content: string
}
