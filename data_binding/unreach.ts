import {
  dictionary,
  reactiveKey,
  isLocked,
  RecursiveCallback,
  RecursiveTuple,
  BeakoObject
} from './types.ts'

import { clean } from './unwatch.ts'

export function unreach(data: unknown, callback: RecursiveCallback): unknown
{
  return _unreach(data, callback, false, [])
}

export function _unreach(data: unknown, callback: RecursiveCallback, isClean: boolean, blocker: unknown[]): unknown
{
  if (
    typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data)) &&
    !blocker.includes(data)
  ) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      blocker.push(data)
      // Remove bio from all properties
      if (obj[dictionary]) {
        (obj[dictionary][reactiveKey] as RecursiveTuple)[1].delete(callback)
      }
      for (const key in obj) {
        _unreach(obj[key], callback, isClean, blocker)
      }
      if (isClean) {
        clean(obj)
      }
      blocker.pop()
    }
  }
  return data
}