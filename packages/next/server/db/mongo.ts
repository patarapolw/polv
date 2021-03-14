import {
  Severity,
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import * as z from 'zod'

export const zTheme = z
  .object({
    title: z.string(),
    banner: z.string(),
    baseUrl: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tabs: z
      .array(
        z.object({
          name: z.string(),
          id: z.string(),
          q: z.string(),
        })
      )
      .optional(),
    author: z
      .object({
        url: z.string().optional(),
        email: z.string().optional(),
        name: z.string(),
        image: z.string(),
      })
      .nonstrict(),
    social: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        reddit: z.string().optional(),
        quora: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .nonstrict(),
    sidebar: z
      .object({
        tagCloud: z.boolean().optional(),
        twitter: z.string().optional(),
      })
      .optional(),
    analytics: z
      .object({
        plausible: z.string().optional(),
      })
      .optional(),
    comment: z
      .object({
        remark42: z
          .object({
            host: z.string(),
            siteId: z.string(),
            locale: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .nonstrict()

export type ITheme = z.infer<typeof zTheme>

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class User {
  @prop({ default: '_' }) _id?: string
  @prop({ validate: (v) => !!zTheme.parse(v) }) theme!: ITheme
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

@index({ text: 'text' })
class Entry {
  @prop({ unique: true, required: true }) path!: string
  @prop({ index: true, required: true }) title!: string
  @prop() image?: string
  @prop({ index: true, default: () => [] }) tag?: string[]
  @prop({ required: true }) text!: string
  @prop() markdown?: string
  @prop({ required: true }) html!: string
  @prop({ index: true }) date?: Date
}

export const EntryModel = getModelForClass(Entry, {
  schemaOptions: { timestamps: true },
})
