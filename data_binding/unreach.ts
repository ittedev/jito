import {
  isReactive,
  recursiveKey,
  ReactivableObject,
  RecursiveCallback,
  ReactiveObject,
  instanceOfReactivableObject
} from './types.ts'

import { deReactivate } from './unwatch.ts'

export function unreach(data: unknown, callback: RecursiveCallback): unknown
{
  return _unreach(data, [], false, callback)
}

export function _unreach(data: unknown, blocker: ReactivableObject[], isDeReactivate: boolean, callback?: RecursiveCallback): unknown
{
  if (instanceOfReactivableObject(data) && !blocker.includes(data)) {
    blocker.push(data)
    if (data[isReactive]) {
      let obj = data as ReactiveObject
      if (callback) {
        // Remove bio from all properties
        obj[isReactive][recursiveKey][1].delete(callback)
      } else {
        // Remove bio from all properties
        obj[isReactive][recursiveKey][1].clear()
        // Remove arm from all properties
        for (let key in obj) {
          obj[isReactive][key][1].clear()
        }
      }
    }
    for (let key in data) {
      _unreach(data[key], blocker, isDeReactivate, callback)
    }
    if (isDeReactivate) {
      deReactivate(data)
    }
    blocker.pop()
    console.log('_unreach:', data)
  }
  return data
}