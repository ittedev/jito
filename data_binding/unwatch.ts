// deno-lint-ignore-file no-explicit-any
import {
  dictionary,
  reactiveKey,
  isLocked,
  Callback,
  TargetCallback,
  RecursiveCallback,
  RecursiveTuple,
  BeakoObject
} from './types.ts'

export function unwatch(
  data: unknown
): unknown

export function unwatch(
  data: unknown,
  callback: RecursiveCallback
): unknown

export function unwatch(
  data: unknown,
  key: string,
  callback: TargetCallback
): unknown

export function unwatch(
  data: unknown,
  keys: string[],
  callback: TargetCallback
): unknown

export function unwatch(
  data: unknown,
  keyOrCallback?: RecursiveCallback | string | string[],
  callback?: TargetCallback
): unknown
{
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      if (callback === undefined) { // RecursiveCallback
        if (keyOrCallback) {
          const RecursiveCallback = keyOrCallback as RecursiveCallback

          // Remove bio from all properties
          if (obj[dictionary]) {
            (obj[dictionary][reactiveKey] as RecursiveTuple)[1].delete(RecursiveCallback)
          }
          for (const key in obj) {
            unwatch(obj[key], RecursiveCallback)
          }
        } else {
          for (const key in obj) {
            unwatch(obj[key])
          }
          clean(obj)
        }
      } else { // TargetCallback
        if (Array.isArray(keyOrCallback)) {
          keyOrCallback.forEach(key => clean(obj, key as string, callback))
        } else {
          clean(obj, keyOrCallback as string, callback)
        }
      }
    }
  }
  return data
}
// TODO: Block recursion

export function clean(obj: BeakoObject, key?: string, callback?: Callback)
{
  if (key !== undefined) {
    if (dictionary in obj) {
      if (key in obj[dictionary]) {
        if (callback) {
          obj[dictionary][key][1].forEach(arm => {
            if (arm[1] === callback) {
              obj[dictionary][key as string][1].delete(arm)
            }
          })
        } else {
          obj[dictionary][key][1].clear()
        }
      }
    }
  } else {
    for (const key in obj[dictionary]) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: obj[dictionary][key][0]
      })
      delete obj[dictionary][key]
    }
    if (Array.isArray(obj)) {
      delete (obj as any).push
      delete (obj as any).sort
      delete (obj as any).splice

    }
    delete (obj as any)[dictionary]
  }
}
