// deno-lint-ignore-file no-explicit-any
// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, isLocked, reactiveKey, arrayKey, ReactiveTuple, ReactiveCallback, Page, Arm, BeakoObject } from './types.ts'
import { watch } from './watch.ts'

const watchMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'copyWithin']

function attack(page: Page, value: unknown) {
  const old = page[0]
  page[0] = value

  if (old !== value) {
    page[1].forEach(arm => {
      switch(arm[0]) {
        case 'bio':
          (arm[1] as ReactiveCallback)()
          break
        // deno-lint-ignore no-fallthrough
        case 'bom':
          page[1].delete(arm)
        case 'spy':
          arm[1](value, old)
          break
      }
    })
  }
}

export function invade(obj: BeakoObject, key?: string | number, arm?: Arm): void {
  if (!obj[isLocked]) {
    if (!(dictionary in obj)) {
      const reactiveCallback: ReactiveCallback = () => {
        (obj[dictionary][reactiveKey] as ReactiveTuple)[1].forEach(callback => callback())
      }
      obj[dictionary] = {
        [reactiveKey]: [['bio', reactiveCallback], new Set<ReactiveCallback>()] as ReactiveTuple
      }
      if (Array.isArray(obj)) {
        const array = obj[dictionary][arrayKey] = obj.slice() as Array<unknown>
        Object.defineProperty(obj, 'push', {
          get: function () {
            return function (...items: any[]): number {
              const result = Array.prototype['push'].call(array, ...items)
              watch(obj)
              reactiveCallback()
              return result
            }
          }
        })
        Object.defineProperty(obj, 'sort', {
          get: function () {
            return function (compareFn?: ((a: any, b: any) => number) | undefined) {
              const result = compareFn === undefined ?
                Array.prototype['sort'].call(array) :
                Array.prototype['sort'].call(array, compareFn)
              reactiveCallback()
              return result
            }
          }
        })
        Object.defineProperty(obj, 'splice', {
          get: function () {
            return function (start: number, deleteCount?: number | undefined, ...items: any[]) {
              const result = deleteCount === undefined ?
                Array.prototype['splice'].call(array, start, array.length - start) :
                Array.prototype['splice'].apply(array, [start, deleteCount, ...items])
              watch(obj)
              reactiveCallback()
              return result
            }
          }
        })
      }
    }
    
    if (key !== undefined) {
      if (typeof key === 'number') {
        if (!(key in obj) && key in obj[dictionary][arrayKey]) {
          Object.defineProperty(obj, key, {
            get() { return this[dictionary][arrayKey][key] },
            set(value) {
              (obj[dictionary][reactiveKey] as ReactiveTuple)[1].forEach(callback => watch(value, callback))
              this[dictionary][arrayKey][key] = value
              (obj[dictionary][reactiveKey] as ReactiveTuple)[0]()
            },
            configurable: true
          })
        }
      } else {
        if (!(key in obj[dictionary])) {
          obj[dictionary][key] = [obj[key], new Set<Arm>()]
          Object.defineProperty(obj, key, {
            get() { return this[dictionary][key][0] },
            set(value) {
              (obj[dictionary][reactiveKey] as ReactiveTuple)[1].forEach(callback => watch(value, callback))
              attack(this[dictionary][key] as Page, value)
            }
          })
        }
        if (arm) {
          for (const item of obj[dictionary][key][1]) {
            if (item[1] === arm[1]) return
          }
          obj[dictionary][key][1].add(arm)
        }
      }
    }
  }
}
