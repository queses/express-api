import { Readable } from 'stream'

export class StreamUtil {
  static streamToBuffer (resultStream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const resultBuffers: Buffer[] = []
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

  static isStream <T extends any> (obj: T) {
    return (obj && typeof obj.pipe === 'function' && typeof obj.on === 'function')
  }
}
