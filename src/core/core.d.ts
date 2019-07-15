export type ConstructorType <C, A extends any[] = any[]> = new (...args: A) => C

export interface Logger {
  log (message: string): void
  error (message: string, trace?: string): void
  warn (message: string): void
}

export type WebErrorResponse = {
  code: number
  status: string
  message?: string
  trace?: string
}
