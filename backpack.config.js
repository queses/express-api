// backpack.config.js
const envConf = require('./env.config.js')
const path = require('path')
const dotenv = require('dotenv')

module.exports = {
  webpack: (config, options, webpack) => {
    config.plugins.push(new webpack.DefinePlugin({
      'global.env': dotenv.config()
    }))

    return config
  }
}
