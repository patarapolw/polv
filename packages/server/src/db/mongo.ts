import {
  Severity,
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import S from 'jsonschema-definer'

export const sTheme = S.shape({
  title: S.string(),
  banner: S.string(),
  baseUrl: S.string(),
  description: S.string().optional(),
  keywords: S.list(S.string()).optional(),
  tabs: S.list(
    S.shape({
      name: S.string(),
      id: S.string(),
      q: S.string(),
    })
  ).optional(),
  author: S.shape({
    url: S.string().optional(),
    email: S.string().optional(),
    name: S.string(),
    image: S.string(),
  }).additionalProperties(true),
  social: S.shape({
    facebook: S.string().optional(),
    twitter: S.string().optional(),
    reddit: S.string().optional(),
    quora: S.string().optional(),
    github: S.string().optional(),
    linkedin: S.string().optional(),
  }).additionalProperties(true),
  sidebar: S.shape({
    tagCloud: S.boolean().optional(),
    twitter: S.string().optional(),
  }).optional(),
  analytics: S.shape({
    plausible: S.string().optional(),
  }).optional(),
  comment: S.shape({
    remark42: S.shape({
      host: S.string(),
      siteId: S.string(),
      locale: S.string().optional(),
    }).optional(),
  }).optional(),
}).additionalProperties(true)

export type ITheme = typeof sTheme.type

// From https://randomkeygen.com/. Make sure it is unsearchable.
export const SEPARATOR = '<!-- cUVdnfHD4e0kM4v4VPiCRC4HV26PuPvZ -->'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class User {
  @prop({ default: '_' }) _id?: string
  @prop({ validate: (v) => !!sTheme.ensure(v) }) theme!: ITheme
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

@index({ text: 'text' })
class Entry {
  @prop({ unique: true, required: true }) path!: string
  @prop({ index: true, required: true }) title!: string
  @prop() image?: string
  @prop({ index: true, default: () => [], type: String }) tag?: string[]
  @prop({ index: true }) date?: Date

  @prop({
    required: true,
    validate: (v: string) => v.includes(SEPARATOR),
  })
  text!: string

  @prop({
    validate: (v: string) => v.includes(SEPARATOR),
  })
  markdown?: string

  @prop({
    required: true,
    validate: (v: string) => v.includes(SEPARATOR),
  })
  html!: string
}

export const EntryModel = getModelForClass(Entry, {
  schemaOptions: { timestamps: true },
})
