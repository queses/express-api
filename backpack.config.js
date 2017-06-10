// backpack.config.js
const envConf = require('./env.config.js')

module.exports = {
  webpack: (config, options, webpack) => {
    config.plugins.push(new webpack.DefinePlugin({
      'global.env': envConf
    }))
    // Perform customizations to config
    // Important: return the modified config
    return config
  }
}
