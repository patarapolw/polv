import fs from 'fs'

import dotenv from 'dotenv-flow'
import ejs from 'ejs'

const env = dotenv.parse(['.env', '.env.public'])

ejs
  .renderFile('app.ejs.yaml', {
    MONGO_URI: env['MONGO_URI'],
  })
  .then((data) => {
    fs.writeFileSync('app.yaml', data)
  })
