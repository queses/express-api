module.exports.streamToBuffer = (resultStream) => {
  return new Promise((resolve, reject) => {
    const resultBuffers = []
    resultStream.on('data', data => {
      resultBuffers.push(data)
    })

    resultStream.on('end', () => {
      resolve(Buffer.concat(resultBuffers))
    })

    resultStream.on('error', err => {
      reject(err)
    })
  })
}

module.exports.isStream = (obj) => {
  return (obj && typeof obj.pipe === 'function' && typeof obj.on === 'function')
}
