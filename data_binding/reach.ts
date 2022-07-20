import {
  isReactive,
  recursiveKey,
  RecursiveCallback,
  ReactivableObject,
  ReactiveObject,
  instanceOfReactivableObject
} from './types.ts'

import { reactivate } from './watch.ts'

export function reach(data: unknown, callback: RecursiveCallback): unknown
{
  _reach(data, [], false, callback)
  return data
}

export function _reach(data: unknown, blocker: ReactivableObject[], isReactivate: boolean, callback?: RecursiveCallback): unknown
{
  if (instanceOfReactivableObject(data) && !blocker.includes(data)) {
    blocker.push(data)
    if (isReactivate) {
      reactivate(data)
    }
    if (callback && isReactive in data) {
      (data as ReactiveObject)[isReactive][recursiveKey][1].add(callback)
    }
    for (let key in data) {
      _reach(data[key], blocker, isReactivate, callback)
    }
    blocker.pop()
  }
  return data
}
