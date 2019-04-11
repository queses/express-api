import express from 'express'
import compression from 'compression'
import fs from 'fs'

import api from './routes/api'
import config from './config.js'
global.conf = config

let createDir = (uri) => {
  if (!fs.existsSync(uri)){
    fs.mkdirSync(uri);
    console.log(`Directory ${uri} created!`)
  }
}

for (let dir of config.dirs) {
  createDir(dir)
}

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3001

app.set('port', port)

// Import API Routes
app.use('/api', api)
app.use('/api/static', express.static(config.staticPath));

app.listen(port, host)