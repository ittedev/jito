// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, isLocked, reactiveKey, arrayKey, ReactiveTuple, ChangeCallback, ReactiveCallback, BeakoObject, Bio, Spy } from './types.ts'
import { invade } from './invade.ts'

export function watch(data: unknown): unknown
export function watch(data: unknown, callback: ReactiveCallback): unknown
export function watch(data: unknown, key: string, callback: ChangeCallback): unknown
export function watch(data: unknown, key: string, spy: Spy): unknown
export function watch(data: unknown, keys: string[], callback: ChangeCallback): unknown
export function watch(data: unknown, keys: string[], spy: Spy): unknown
export function watch(data: unknown, keyOrCallback?:  ReactiveCallback | Bio | string | string[], callback?: ChangeCallback | Spy): unknown {
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      invade(obj)
      if (callback === undefined) { // bio
        const callbacks = (obj[dictionary][reactiveKey] as ReactiveTuple)[1]
        if (typeof keyOrCallback === 'function') {
          callbacks.add(keyOrCallback)
        }
        for (const key in obj) {
          if (typeof key !== 'number') {
            invade(obj, key, (obj[dictionary][reactiveKey] as ReactiveTuple)[0])
            const value = obj[key]
            // Change all child objects to beako objects
            // and set parent bio to all child object
            if (typeof value === 'object' && value !== null) {
              if (callbacks.size) {
                callbacks.forEach(callback => {
                  if (!(dictionary in value) || !((value as BeakoObject)[dictionary][reactiveKey] as ReactiveTuple)[1].has(callback)) { // Block recursion
                    watch(value, callback)
                  }
                })
              } else {
                if (!(dictionary in value)) { // Block recursion
                  watch(value)
                }
              }
            }
          }
        }
        if (Array.isArray(obj)) {
          const len = obj[dictionary][arrayKey].length
          if (obj.length < len) {
            for (let index = obj.length; index < len; index++) {
              invade(obj, index)
            }
          }
          obj.length = len
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
  }
  return data
}
