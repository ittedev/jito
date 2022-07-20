import {
  isReactive,
  ReactiveObject,
  recursiveKey,
  RecursiveTuple
} from './types.ts'

import { addReactive } from './watch.ts'

export function change(data: unknown, key: string, value: unknown): unknown
{
  if (typeof data === 'object' && data !== null) {
    if (!(key in data) && isReactive in data) {
      let obj = data as ReactiveObject
      obj[key] = undefined
      addReactive(obj, key, obj[isReactive][recursiveKey][0])
    }
    (data as Record<string, unknown>)[key] = value
  }
  return value
}
