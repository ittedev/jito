// deno-lint-ignore-file no-explicit-any
import {
  dictionary,
  isLocked,
  reactiveKey,
  arrayKey,
  RecursiveTuple,
  TargetCallback,
  RecursiveCallback,
  PageTuple,
  ArmTuple,
  BeakoObject,
  BioTuple,
  SpyTuple
} from './types.ts'

export function watch<T>(data: T): T
export function watch<T>(data: T, callback: RecursiveCallback): T
export function watch<T>(data: T, key: string, callback: TargetCallback): T
export function watch<T>(data: T, key: string, spy: SpyTuple): T
export function watch<T>(
  data: T,
  keyOrCallback?:  RecursiveCallback | BioTuple | string,
  callback?: TargetCallback | SpyTuple
): T
{
  if (
    typeof data === 'object' &&
    data !== null &&
    (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))
  ) {
    let obj = data as unknown as BeakoObject
    if (!obj[isLocked]) {
      if (callback === undefined) { // bio
        pollute(obj)
        let callbacks = (obj[dictionary][reactiveKey] as RecursiveTuple)[1]
        if (typeof keyOrCallback === 'function') {
          callbacks.add(keyOrCallback)
        }
        // parent bio to all child object
        for (let key in obj) {
          let value = obj[key]
          if (typeof value === 'object' && value !== null) {
            if (callbacks.size) {
              callbacks.forEach(callback => {
                if (!(dictionary in value) || !(value as BeakoObject)[dictionary][reactiveKey][1].has(callback)) { // Block recursion
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
      } else { // spy
        let spy = typeof callback === 'function' ? ['spy', callback] as SpyTuple : callback as SpyTuple
        pollute(obj, keyOrCallback as string, spy)
      }
    }
  }
  return data
}

export function pollute(obj: BeakoObject, key?: string | number, arm?: ArmTuple): void
{
  if (!obj[isLocked]) {
    if (!(dictionary in obj)) {
      let recursiveCallback: RecursiveCallback = () => {
        (obj[dictionary][reactiveKey] as RecursiveTuple)[1].forEach(callback => callback())
      }
      let bio = ['bio', recursiveCallback] as BioTuple
      obj[dictionary] = {
        [reactiveKey]: [bio, new Set<RecursiveCallback>()] as RecursiveTuple
      }
      if (Array.isArray(obj)) {
        let array = obj[dictionary][arrayKey] = obj.slice() as Array<unknown>
        let reactive = <T>(value: T): T => {
          recursiveCallback()
          return value
        }
        let relength = <T>(value: T): T => {
          let len = (obj[dictionary][arrayKey] as Array<unknown>).length
          if (obj.length < len) {
            for (let index = obj.length; index < len; index++) {
              pollute(obj, index)
            }
          }
          obj.length = len
          return reactive(value)
        }
        Object.defineProperties(obj, {
          unshift: {
            get() {
              return (...items: any[]): number =>
              relength(Array.prototype['unshift'].call(array, ...items.map(item => infect(obj, item))))
            }
          },
          push: {
            get() {
              return (...items: any[]): number =>
              relength(Array.prototype['push'].call(array, ...items.map(item => infect(obj, item))))
            }
          },
          splice: {
            get() {
              return (start: number, deleteCount?: number | undefined, ...items: any[]) =>
                relength(
                  deleteCount === undefined ?
                    Array.prototype['splice'].call(array, start, array.length - start) :
                    Array.prototype['splice'].apply(array, [start, deleteCount, ...items.map(item => infect(obj, item))])
                )
              }
          },
          pop: {
            get() { return () => relength(Array.prototype['pop'].call(array)) }
          },
          shift: {
            get() { return () => relength(Array.prototype['shift'].call(array)) }
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
      for (let key in obj) {
        pollute(obj, key, bio)
      }
    }

    if (key !== undefined) {
      if (!Array.isArray(obj) || typeof key !== 'number' && isNaN(key as unknown as number)) {
        if (!(key in obj[dictionary])) {
          obj[dictionary][key] = [obj[key], new Set<ArmTuple>()]
          Object.defineProperty(obj, key, {
            get() { return this[dictionary][key][0] },
            set(value) {
              infect(obj, value)
              launch(this[dictionary][key] as PageTuple, value)
            }
          })
        }
        if (arm) {
          for (let item of obj[dictionary][key][1]) {
            if (item[1] === arm[1]) return
          }
          obj[dictionary][key][1].add(arm)
        }
      } else {
        let descriptor = Object.getOwnPropertyDescriptor(obj, key)
        if (!descriptor || 'value' in descriptor) {
          if (key in (obj[dictionary][arrayKey] as Array<unknown>)) {
            Object.defineProperty(obj, key, {
              get() { return this[dictionary][arrayKey][key] },
              set(value) {
                infect(obj, value)
                let old = this[dictionary][arrayKey][key]
                this[dictionary][arrayKey][key] = value
                if (old !== value) {
                  obj[dictionary][reactiveKey][0][1]()
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

/**
 * Copy bio only
 */
function infect(obj: BeakoObject, data: unknown)
{
  obj[dictionary][reactiveKey][1].forEach(callback => watch(data, callback))
  return data
}

function launch(page: PageTuple, value: unknown)
{
  let old = page[0]
  page[0] = value

  if (old !== value) {
    page[1].forEach(arm => {
      switch(arm[0]) {
        case 'bio':
          (arm[1] as RecursiveCallback)()
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