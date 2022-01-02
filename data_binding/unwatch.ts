// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ChangeCallback, ReactiveCallback, BeakoObject } from './types.ts'
import { retreat } from './retreat.ts'

export function unwatch(data: unknown): unknown
export function unwatch(data: unknown, callback: ReactiveCallback): unknown
export function unwatch(data: unknown, key: string, callback: ChangeCallback): unknown
export function unwatch(data: unknown, keys: string[], callback: ChangeCallback): unknown
export function unwatch(data: unknown, keyOrCallback?:  ReactiveCallback | string | string[], callback?: ChangeCallback): unknown {
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    if (callback === undefined) { // ReactiveCallback
      if (keyOrCallback) {
        // Remove bio from all properties
        const reactiveCallback = keyOrCallback as ReactiveCallback
        for (const key in obj) {
          retreat(obj, key, reactiveCallback)
          unwatch(obj[key], reactiveCallback)
        }
      } else {
        for (const key in obj) {
          unwatch(obj[key])
        }
        retreat(obj)
      }
    } else { // ChangeCallback
      if (Array.isArray(keyOrCallback)) {
        keyOrCallback.forEach(key => retreat(obj, key as string, callback))
      } else {
        retreat(obj, keyOrCallback as string, callback)
      }
    }
  }
  return data
}
