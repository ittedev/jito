// deno-lint-ignore-file no-explicit-any
import {
  isReactive,
  Callback,
  TargetCallback,
  RecursiveCallback,
  ReactivableObject,
  ReactiveObject,
  recursiveKey,
  instanceOfReactivableObject
} from './types.ts'

import { _unreach } from './unreach.ts'

export function unwatch<T>(data: T): T
export function unwatch<T>(data: T, callback: RecursiveCallback): T
export function unwatch<T>(data: T, key: string, callback: TargetCallback): T
export function unwatch<T>(
  data: T,
  keyOrCallback?: RecursiveCallback | string,
  callback?: TargetCallback
): T
{
  if (instanceOfReactivableObject(data)) {
    if (keyOrCallback === undefined) { // All deReactivate
      _unreach(data, [], true)
    } else if (callback) { // TargetCallback
      removeReactive(data as ReactiveObject, keyOrCallback as string, callback)
      deReactivate(data)
    } else { // RecursiveCallback
      _unreach(data, [], true, keyOrCallback as RecursiveCallback)
    }
  }
  return data
}

export function deReactivate(obj: ReactivableObject)
{
  if (isReactive in obj) {
    let robj = obj as ReactiveObject
    if (!robj[isReactive][recursiveKey][1].size) {
      let hasTarget = false
      for (let key in robj) {
        if (robj[isReactive][key][1].size > 1) {
          hasTarget = true
        }
      }
      if (!hasTarget) {
        for (let key in robj[isReactive]) {
          Object.defineProperty(robj, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: robj[isReactive][key][0]
          })
          delete robj[isReactive][key]
        }
        if (Array.isArray(robj)) {
          delete (robj as any).unshift
          delete (robj as any).push
          delete (robj as any).splice
          delete (robj as any).pop
          delete (robj as any).shift
          delete (robj as any).sort
          delete (robj as any).reverse
          delete (robj as any).copyWithin
        }
        delete (robj as any)[isReactive]
      }
    }
  }
}

export function removeReactive(obj: ReactiveObject, key: string | number, callback: Callback): void
{
  if (key in obj[isReactive]) {
    obj[isReactive][key][1].forEach(reactive => {
      if (reactive[1] === callback) {
        obj[isReactive][key][1].delete(reactive)
      }
    })
  }
}
