import crypto from 'crypto'

export const getHash = (source, toHex = true) => {
  const hash = crypto.createHash('sha256')
  hash.update(source)

  return hash.digest((toHex) ? 'hex' : 'base64')
}
