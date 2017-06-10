import present from 'present'

const isProd = () => process.env.NODE_ENV === 'production'

const devPresent = () => {
  if (isProd()) return 0
  else return present() 
}

function devLog () {
  if (!isProd()) {
    for (let arg of arguments) console.log(arg)
  }
}

const streamToBuffer = (lStream, onEnd) => {
  return new Promise((resolve, reject) => {
    let bufs = []
    lStream.on('data', (d) => { 
      bufs.push(d) 
    })
    lStream.on('end', () => {
      resolve(Buffer.concat(bufs))
    }) 
  })
}

export { isProd, devPresent, devLog, streamToBuffer }
