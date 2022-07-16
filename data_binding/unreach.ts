import {
  dictionary,
  reactiveKey,
  isLocked,
  RecursiveCallback,
  BeakoObject
} from './types.ts'

import { clean } from './unwatch.ts'

export function unreach(data: unknown, callback: RecursiveCallback): unknown
{
  return _unreach(data, [], false, callback)
}

export function _unreach(data: unknown, blocker: unknown[], isClean: boolean, callback?: RecursiveCallback): unknown
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
      if (obj[dictionary]) {
        if (callback !== undefined) {
          // Remove bio from all properties
          obj[dictionary][reactiveKey][1].delete(callback)
        } else {
          // Remove bio from all properties
          obj[dictionary][reactiveKey][1].clear()
          // Remove arm from all properties
          for (const key in obj) {
            obj[dictionary][key][1].clear()
          }
        }
      }
      for (const key in obj) {
        _unreach(obj[key], blocker, isClean, callback)
      }
      if (isClean) {
        clean(obj)
      }
      blocker.pop()
    }
  }
  return data
}