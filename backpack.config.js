// backpack.config.js
const envConf = require('./env.config.js')
const path = require('path')

module.exports = {
  webpack: (config, options, webpack) => {
    config.plugins.push(new webpack.DefinePlugin({
      'global.env': envConf
    }))
    config.resolve.alias = {
      '~': path.resolve('./src')
    }
    // Perform customizations to config
    // Important: return the modified config
    return config
  }
}
