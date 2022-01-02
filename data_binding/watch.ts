// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, ChangeCallback, ReactiveCallback, BeakoObject, Bio, Spy } from './types.ts'
import { invade } from './invade.ts'

export function watch(data: unknown): unknown
export function watch(data: unknown, callback: ReactiveCallback): unknown
export function watch(data: unknown, bio: Bio): unknown
export function watch(data: unknown, key: string, callback: ChangeCallback): unknown
export function watch(data: unknown, key: string, spy: Spy): unknown
export function watch(data: unknown, keys: string[], callback: ChangeCallback): unknown
export function watch(data: unknown, keys: string[], spy: Spy): unknown
export function watch(data: unknown, keyOrCallback?:  ReactiveCallback | Bio | string | string[], callback?: ChangeCallback | Spy): unknown {
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    invade(obj)
    if (callback === undefined) { // bio
      // Set bio to all properties
      const bio = keyOrCallback ? (typeof keyOrCallback === 'function' ? ['bio', keyOrCallback] as Bio : keyOrCallback as Bio) : undefined
      for (const key in obj) {
        invade(obj, key, bio)
      }

      // Change all child objects to beako objects
      // and set parent bio to all child object 
      if (Array.isArray(obj)) {
        // TODO: watch Array
        // [index]
        // push()
        // pop()
        // shift()
        // unshift()
        // sort()
        // reverse()
        // splice()
        // copyWithin()
        return obj
      } else {
        for (const key in obj) {
          const bios = [...obj[dictionary][key].arms].filter(arm => arm[0] === 'bio')
          if (bios.length) {
            bios.forEach(arm => watch(obj[key], arm as Bio))
          } else {
            watch(obj[key])
          }
        }
      }
    } else { // spy
      const spy = typeof callback === 'function' ? ['spy', callback] as Spy : callback as Spy
      if (Array.isArray(keyOrCallback)) {
        keyOrCallback.forEach(key => invade(obj, key as string, spy))
      } else {
        invade(obj, keyOrCallback as string, spy)
      }
    }
  }
  return data
}
