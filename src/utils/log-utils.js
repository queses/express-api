import { getIsProd } from './env-utils';

export const logInfo = (...messages) => {
  Reflect.apply(console.log, undefined, messages)
}

export const logDevInfo = (...messages) => {
  if (!getIsProd()) {
    Reflect.apply(console.log, undefined, messages)
  }
}

export const logError = (...messages) => {
  Reflect.apply(console.error, undefined, messages)
}
