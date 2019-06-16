import crypto from 'crypto'

export class CryptoUtil {
  static getHash (source: string, toHex = true) {
    const hash = crypto.createHash('sha256')
    hash.update(source)

    return hash.digest((toHex) ? 'hex' : 'base64')
  }
}
