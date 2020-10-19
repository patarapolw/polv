import rimraf from 'rimraf'

import { buildPath } from './dir'

export function clean() {
  rimraf.sync(buildPath('*.json'))
  // rimraf.sync(dstMediaPath('**/*'))
}
