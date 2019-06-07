import { AxiosError } from 'axios'

export class OriginalImageFetchError extends Error {
  private fetchErr: AxiosError

  constructor (fetchErr: AxiosError, message = '') {
    super()
    this.message = message || 'Error while fetching original image: ' + fetchErr.message
    this.fetchErr = fetchErr
  }
}
