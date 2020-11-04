import path from 'path'

export const CONTENT_PATH = path.resolve(process.cwd(), '../..')

export const srcPostPath = (...ps: string[]) =>
  path.join(CONTENT_PATH, '_post', ...ps)

export const srcMediaPath = (...ps: string[]) =>
  path.join(CONTENT_PATH, '_media', ...ps)

export const buildPath = (...ps: string[]) =>
  path.join(__dirname, '../build', ...ps)

export const dstMediaPath = (...ps: string[]) =>
  path.join(__dirname, '../static/media', ...ps)
