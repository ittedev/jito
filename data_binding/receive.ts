// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { isLocked, BeakoObject } from './types.ts'
import { invade } from './watch.ts'

export async function receive(
  obj: BeakoObject,
  key: string | string[]
): Promise<Record<string, unknown>>
{
  if (!obj[isLocked]) {
    const keys = Array.isArray(key) ? key : [key]
    const values = await Promise.all(keys.map(key => {
      if (obj[key] === undefined) {
        return new Promise(resolve => {
          invade(obj, key, ['bom', resolve])
        })
      } else {
        return obj[key]
      }
    }))
    return keys.reduce((obj, key, index) => {
      obj[key] = values[index]
      return obj
    }, {} as Record<string, unknown>)
    // return Object.fromEntries(keys.map((key, index) => [key, values[index]]))
  }
  return {}
}
