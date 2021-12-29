// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, Callback, BeakoObject } from './types.ts'

export function retreat(obj: BeakoObject, key?: string, callback?: Callback) {
  if (key !== undefined) {
    if (dictionary in obj) {
      if (key in obj[dictionary]) {
        if (callback) {
          obj[dictionary][key].arms.forEach(arm => {
            if (arm[1] === callback) {
              obj[dictionary][key as string].arms.delete(arm)
            }
          })
        } else {
          obj[dictionary][key].arms.clear()
        }
        if (!obj[dictionary][key].arms.size) {
          Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: obj[dictionary][key].value
          })
          delete obj[dictionary][key]
        }
      }
    }
  } else {
    for (const key in obj[dictionary]) {
      retreat(obj, key)
    }
    // deno-lint-ignore no-explicit-any
    delete (obj as any)[dictionary]
  }
}