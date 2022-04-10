// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  dictionary,
  isLocked,
  reactiveKey,
  ReactiveTuple,
  ReactiveCallback,
  BeakoObject
} from './types.ts'

export function reach(data: unknown, callback:  ReactiveCallback): unknown
{
  if (
    typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))
  ) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      if (dictionary in obj) {
        (obj[dictionary][reactiveKey] as ReactiveTuple)[1].add(callback)
      }
      for (const key in obj) {
        reach(obj[key], callback)
      }
    }
  }
  return data
}
