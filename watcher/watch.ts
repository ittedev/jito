// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { dictionary, Callback, DictionaryPage, Dictionary, BearkoObject } from './types.ts'

export function watch(data: unknown, path?: string | string[], callback?: Callback): unknown {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      // TODO: watch Array
      return data
    } else {
      const pathes = callback && path ? [path].flat() : []
      const obj = data as BearkoObject
      if (!(dictionary in obj)) {
        obj[dictionary] = {} as Dictionary
      }
      for (const key in obj) {
        if (!(key in obj[dictionary])) {
          obj[dictionary][key] = {
            v: watch(
              obj[key],
              pathes.flatMap(path => path.startsWith(key + '.') ? path.slice(key.length + 1) : []),
              callback
            ),
            f: new Set<Callback>()
          }
          Object.defineProperty(obj, key, {
            get: function() { return this[dictionary][key].v },
            set: function(val) {
              const page = this[dictionary][key] as DictionaryPage
              const old = page.v
              page.v = watch(val)
              if (old !== val) {
                page.f.forEach(callback => callback(val, old))
              }
            }
          })
        }
        if (pathes.some(path => path === key)) {
          obj[dictionary][key].f.add(callback as Callback)
        }
      }
    }
  }
  return data
}
