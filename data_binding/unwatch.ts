// deno-lint-ignore-file no-explicit-any
// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, reactiveKey, isLocked, Callback, ChangeCallback, ReactiveCallback, ReactiveTuple, BeakoObject } from './types.ts'

export function unwatch(data: unknown): unknown
export function unwatch(data: unknown, callback: ReactiveCallback): unknown
export function unwatch(data: unknown, key: string, callback: ChangeCallback): unknown
export function unwatch(data: unknown, keys: string[], callback: ChangeCallback): unknown
export function unwatch(data: unknown, keyOrCallback?:  ReactiveCallback | string | string[], callback?: ChangeCallback): unknown {
  if (typeof data === 'object' && data !== null) {
    const obj = data as BeakoObject
    if (!obj[isLocked]) {
      if (callback === undefined) { // ReactiveCallback
        if (keyOrCallback) {
          const reactiveCallback = keyOrCallback as ReactiveCallback

          // Remove bio from all properties
          if (obj[dictionary]) {
            (obj[dictionary][reactiveKey] as ReactiveTuple)[1].delete(reactiveCallback)
          }
          for (const key in obj) {
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
  }
  return data
}
// TODO: Block recursion

export function retreat(obj: BeakoObject, key?: string, callback?: Callback) {
  if (key !== undefined) {
    if (dictionary in obj) {
      if (key in obj[dictionary]) {
        if (callback) {
          obj[dictionary][key][1].forEach(arm => {
            if (arm[1] === callback) {
              obj[dictionary][key as string][1].delete(arm)
            }
          })
        } else {
          obj[dictionary][key][1].clear()
        }
      }
    }
  } else {
    for (const key in obj[dictionary]) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: obj[dictionary][key][0]
      })
      delete obj[dictionary][key]
    }
    if (Array.isArray(obj)) {
      delete (obj as any).push
      delete (obj as any).sort
      delete (obj as any).splice

    }
    delete (obj as any)[dictionary]
  }
}
