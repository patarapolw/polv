import path from 'path'

export const buildPath = (...ps: string[]): string =>
  path.join(__dirname, '../build', ...ps)

export const dstMediaPath = (...ps: string[]): string =>
  path.join(__dirname, '../static/media', ...ps)
