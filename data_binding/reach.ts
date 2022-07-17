import {
  dictionary,
  isLocked,
  reactiveKey,
  RecursiveCallback,
  BeakoObject
} from './types.ts'

export function reach(data: unknown, callback: RecursiveCallback): unknown
{
  _reach(data, callback, [])
  return data
}

export function _reach(data: unknown, callback: RecursiveCallback, blocker: unknown[]): unknown
{
  if (
    typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))
  ) {
    let obj = data as BeakoObject
    if (!obj[isLocked]) {
      blocker.push(data)
      if (dictionary in obj) {
        obj[dictionary][reactiveKey][1].add(callback)
      }
      for (let key in obj) {
        _reach(obj[key], callback, blocker)
      }
      blocker.pop()
    }
  }
  return data
}
