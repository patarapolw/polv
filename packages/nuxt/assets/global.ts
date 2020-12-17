import type { ITheme } from '../server/theme'

export const THEME: ITheme = JSON.parse(process.env.THEME!)

export const TAG: Record<string, number> = JSON.parse(process.env.TAG!)
