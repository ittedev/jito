import {
  dictionary,
  BeakoObject,
  reactiveKey,
  ReactiveTuple
} from './types.ts'

import { pollute } from './watch.ts'

export function change(data: unknown, key: string, value: unknown): unknown {
  if (typeof data === 'object' && data !== null) {
    if (!(key in data) && dictionary in data) {
      const obj = data as BeakoObject
      obj[key] = undefined
      pollute(obj, key, (obj[dictionary][reactiveKey] as ReactiveTuple)[0])
    }
    (data as Record<string, unknown>)[key] = value
  }
  return value
}
