import path from 'path'

export const builtPath = (...ps: string[]): string =>
  path.join(__dirname, '../built', ...ps)

export const dstMediaPath = (...ps: string[]): string =>
  path.join(__dirname, '../static/media', ...ps)
