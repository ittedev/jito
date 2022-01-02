// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, ReactiveCallback, Page, Arm, Dictionary, BeakoObject } from './types.ts'

function attack(page: Page, value: unknown) {
  const old = page.value
  if (old !== value) {
    page.arms.forEach(arm => {
      switch(arm[0]) {
        case 'bio':
          (arm[1] as ReactiveCallback)()
          break
        // deno-lint-ignore no-fallthrough
        case 'bom':
          page.arms.delete(arm)
        case 'spy':
          arm[1](value, old)
          break
      }
    })
  }
  page.value = value
}

export function invade(obj: BeakoObject, key?: string, arm?: Arm) {
  if (!(dictionary in obj)) {
    obj[dictionary] = {} as Dictionary
  }
  
  if (key !== undefined) {
    if (!(key in obj[dictionary])) {
      obj[dictionary][key] = {
        value: obj[key],
        arms: new Set<Arm>()
      }
      Object.defineProperty(obj, key, {
        get() { return this[dictionary][key].value },
        set(value) { attack(this[dictionary][key] as Page, value) }
      })
    }
    if (arm) {
      obj[dictionary][key].arms.add(arm)
    }
  }
}
