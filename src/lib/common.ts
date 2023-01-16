/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export type Nullable<T> = T | null | undefined

type Falsy = 0 | '' | false | null | undefined

export function truthy<T>(x: T): x is Exclude<T, Falsy> {
  return !!(x as any)
}

export function falsy<T>(x: T): x is T & Falsy {
  return !(x as any)
}

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

export const env = process.env.NODE_ENV ?? 'local'

console.log(`Environment is loading from .env.${env}`)
