// deno-lint-ignore-file no-explicit-any
// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, Callback, BeakoObject } from './types.ts'

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