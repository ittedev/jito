// deno-lint-ignore-file no-explicit-any
import {
  dictionary,
  Callback,
  TargetCallback,
  RecursiveCallback,
  BeakoObject,
  reactiveKey
} from './types.ts'

import { _unreach } from './unreach.ts'

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
  keyOrCallback?: RecursiveCallback | string,
  callback?: TargetCallback
): unknown
{
  if (keyOrCallback === undefined) { // All clean
    _unreach(data, [], true)
  } else if (callback === undefined) { // RecursiveCallback
    _unreach(data, [], true, keyOrCallback as RecursiveCallback)
  } else { // TargetCallback
    clean(data as BeakoObject, keyOrCallback as string, callback)
  }
  return data
}

export function clean(obj: BeakoObject, key?: string, callback?: Callback)
{
  if (key !== undefined) {
    if (dictionary in obj) {
      if (key in obj[dictionary]) {
        obj[dictionary][key][1].forEach(arm => {
          if (arm[1] === callback) {
            obj[dictionary][key as string][1].delete(arm)
          }
        })
      }
    }
  }
  if (dictionary in obj && obj[dictionary][reactiveKey][1].size) {
    let hasTarget = false
    for (let key in obj) {
      if (obj[dictionary][key][1].size > 1) {
        hasTarget = true
      }
    }
    if (!hasTarget) {
      for (let key in obj[dictionary]) {
        Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: obj[dictionary][key][0]
        })
        delete obj[dictionary][key]
      }
      if (Array.isArray(obj)) {
        delete (obj as any).unshift
        delete (obj as any).push
        delete (obj as any).splice
        delete (obj as any).pop
        delete (obj as any).shift
        delete (obj as any).sort
        delete (obj as any).reverse
        delete (obj as any).copyWithin
      }
      delete (obj as any)[dictionary]
    }
  }
}
