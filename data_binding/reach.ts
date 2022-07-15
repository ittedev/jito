import {
  dictionary,
  isLocked,
  reactiveKey,
  RecursiveTuple,
  RecursiveCallback,
  BeakoObject
} from './types.ts'

export function reach(data: unknown, callback:  RecursiveCallback): unknown
{
  if (
    typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))
  ) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      if (dictionary in obj) {
        (obj[dictionary][reactiveKey] as RecursiveTuple)[1].add(callback)
      }
      for (const key in obj) {
        reach(obj[key], callback)
      }
    }
  }
  return data
}
