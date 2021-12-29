// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, ReactiveCallback, BeakoObject, Bio, Spy } from './types.ts'
import { invade } from './invade.ts'

export function reach(data: unknown, callback: ReactiveCallback): unknown
export function reach(data: unknown, bio: Bio): unknown
export function reach(data: unknown, callback:  ReactiveCallback | Bio): unknown {
  const bio = typeof callback === 'function' ? ['bio', callback] as Bio : callback as Bio
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    if (dictionary in obj) {
      for (const key in obj[dictionary]) {
        invade(obj, key, bio)
      }
    }
    for (const key in obj) {
      reach(obj[key], bio)
    }
  }
  return data
}
