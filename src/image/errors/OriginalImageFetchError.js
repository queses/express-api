class OriginalImageFetchError extends Error {
  constructor (fetchErr, message = '') {
    super()
    this.message = message || 'Error while fetching original image: ' + fetchErr.message
    this.fetchErr = fetchErr
  }
}

module.exports = OriginalImageFetchError
