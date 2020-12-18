import path from 'path'

export const buildPath = (...ps: string[]): string =>
  path.join(process.cwd(), 'build', ...ps)

export const dstMediaPath = (...ps: string[]): string =>
  path.join(process.cwd(), 'public/media', ...ps)
