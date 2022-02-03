// deno-lint-ignore-file no-explicit-any
// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { dictionary, isLocked, reactiveKey, arrayKey, ReactiveTuple, ChangeCallback, ReactiveCallback, Page, Arm, BeakoObject, Bio, Spy } from './types.ts'

export function watch<T>(data: T): T
export function watch<T>(data: T, callback: ReactiveCallback): T
export function watch<T>(data: T, key: string, callback: ChangeCallback): T
export function watch<T>(data: T, key: string, spy: Spy): T
export function watch<T>(data: T, keys: string[], callback: ChangeCallback): T
export function watch<T>(data: T, keys: string[], spy: Spy): T
export function watch<T>(data: T, keyOrCallback?:  ReactiveCallback | Bio | string | string[], callback?: ChangeCallback | Spy): T {
  if (typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))) {
    const obj = data as unknown as BeakoObject
    if (!obj[isLocked]) {
      invade(obj)
      if (callback === undefined) { // bio
        const callbacks = (obj[dictionary][reactiveKey] as ReactiveTuple)[1]
        if (typeof keyOrCallback === 'function') {
          callbacks.add(keyOrCallback)
        }
        for (const key in obj) {
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
        const reactive = <T>(value: T): T => {
          reactiveCallback()
          return value
        }
        const rewatch = <T>(value: T): T => {
          watch(obj)
          reactiveCallback()
          return value
        }
        Object.defineProperties(obj, {
          unshift: {
            get() {
              return (...items: any[]): number =>
                rewatch(Array.prototype['unshift'].call(array, ...items))
            }
          },
          push: {
            get() {
              return (...items: any[]): number =>
                rewatch(Array.prototype['push'].call(array, ...items))
            }
          },
          splice: {
            get() {
              return (start: number, deleteCount?: number | undefined, ...items: any[]) =>
                rewatch(
                  deleteCount === undefined ?
                    Array.prototype['splice'].call(array, start, array.length - start) :
                    Array.prototype['splice'].apply(array, [start, deleteCount, ...items])
                )
              }
          },
          pop: {
            get() { return () => rewatch(Array.prototype['pop'].call(array)) }
          },
          shift: {
            get() { return () => rewatch(Array.prototype['shift'].call(array)) }
          },
          sort: {
            get() {
              return (compareFn?: ((a: any, b: any) => number) | undefined) =>
                reactive(
                  compareFn === undefined ?
                    Array.prototype['sort'].call(array) :
                    Array.prototype['sort'].call(array, compareFn)
                )
            }
          },
          reverse: {
            get() { return () => reactive(Array.prototype['reverse'].call(array)) }
          },
          copyWithin: {
            get() {
              return (target: number, start: number, end?: number | undefined) =>
                reactive(
                  Array.prototype['copyWithin'].call(array,
                    target,
                    start !== undefined ? start : 0,
                    end !== undefined ? end : array.length
                  )
                )
            }
          }
        })
      }
    }
    
    if (key !== undefined) {
      if (typeof key !== 'number' && isNaN(key as unknown as number)) {
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
      } else {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key)
        if (!descriptor || 'value' in descriptor) {
          if (key in obj[dictionary][arrayKey]) {
            Object.defineProperty(obj, key, {
              get() { return this[dictionary][arrayKey][key] },
              set(value) {
                (obj[dictionary][reactiveKey] as ReactiveTuple)[1].forEach(callback => watch(value, callback))
                const old = this[dictionary][arrayKey][key]
                this[dictionary][arrayKey][key] = value
                if (old !== value) {
                  (obj[dictionary][reactiveKey] as ReactiveTuple)[0][1]()
                }
              },
              configurable: true,
              enumerable: true
            })
          }
        }
      }
    }
  }
}

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