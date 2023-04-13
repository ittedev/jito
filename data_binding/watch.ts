// deno-lint-ignore-file no-explicit-any
import {
  isReactive,
  recursiveKey,
  arrayKey,
  RecursiveTuple,
  TargetCallback,
  RecursiveCallback,
  PropertyTuple,
  Reactive,
  ReactivableObject,
  ReactiveObject,
  RecursiveReactive,
  instanceOfReactivableObject
} from './types.ts'

import { _reach } from './reach.ts'
import { unreach } from './unreach.ts'

export function watch<T>(data: T): T
export function watch<T>(data: T, callback: RecursiveCallback, isExecute?: boolean): T
export function watch<T>(data: T, key: string, callback: TargetCallback, isExecute?: boolean): T
export function watch<T>(
  data: T,
  keyOrCallback?:  RecursiveCallback | string,
  isExecuteOrcallback?: TargetCallback | boolean,
  isExecute?: boolean,
): T
{
  if (instanceOfReactivableObject(data)) {
    if (keyOrCallback === undefined) { // reactivate only
      _reach(data, [], true)
    } else if (typeof isExecuteOrcallback === 'function') { // TargetCallback
      _reach(data, [], true)
      addReactive(data as ReactiveObject, keyOrCallback as string, ['spy', isExecuteOrcallback])
      if (isExecute) {
        (isExecuteOrcallback as TargetCallback)(data[keyOrCallback as string], data[keyOrCallback as string])
      }
    } else { // RecursiveCallback
      _reach(data, [], true, keyOrCallback as RecursiveCallback)
      if (isExecuteOrcallback) {
        (keyOrCallback as RecursiveCallback)()
      }
    }
  }
  return data
}

export function reactivate(obj: ReactivableObject): void
{
  if (!(isReactive in obj)) {
    let recursiveCallbacks = new Set<RecursiveCallback>()
    let recursiveCallback: RecursiveCallback = () => {
      recursiveCallbacks.forEach(callback => callback())
    }
    let recursiveReactive = ['bio', recursiveCallback] as RecursiveReactive
    obj[isReactive] = {
      [recursiveKey]: [recursiveReactive, recursiveCallbacks] as RecursiveTuple
    }
    if (Array.isArray(obj)) {
      let array = (obj as ReactiveObject)[isReactive][arrayKey] = obj.slice() as Array<unknown>
      let call = <T>(value: T): T => {
        recursiveCallback()
        return value
      }
      let relength = <T>(value: T): T => {
        let len = ((obj as ReactiveObject)[isReactive][arrayKey] as Array<unknown>).length
        if (obj.length < len) {
          for (let index = obj.length; index < len; index++) {
            addReactive(obj as ReactiveObject, index)
          }
        }
        obj.length = len
        return call(value)
      }
      Object.defineProperties(obj, {
        unshift: {
          get() {
            return (...items: any[]): number =>
            relength(Array.prototype['unshift'].call(array, ...items.map(item => infect(obj as ReactiveObject, item))))
          }
        },
        push: {
          get() {
            return (...items: any[]): number =>
            relength(Array.prototype['push'].call(array, ...items.map(item => infect(obj as ReactiveObject, item))))
          }
        },
        splice: {
          get() {
            return (start: number, deleteCount?: number | undefined, ...items: any[]) =>
              relength(
                deleteCount === undefined ?
                  Array.prototype['splice'].call(array, start, array.length - start) :
                  Array.prototype['splice'].apply(array, [start, deleteCount, ...items.map(item => infect(obj as ReactiveObject, item))])
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
              call(
                compareFn === undefined ?
                  Array.prototype['sort'].call(array) :
                  Array.prototype['sort'].call(array, compareFn)
              )
          }
        },
        reverse: {
          get() { return () => call(Array.prototype['reverse'].call(array)) }
        },
        copyWithin: {
          get() {
            return (target: number, start: number, end?: number | undefined) =>
              call(
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
  if (isReactive in obj) {
    let recursiveReactive = (obj as ReactiveObject)[isReactive][recursiveKey][0]
    for (let key in obj) {
      addReactive(obj as ReactiveObject, key, recursiveReactive)
    }
  }
}

export function addReactive(obj: ReactiveObject, key: string | number, reactive?: Reactive): void
{
  if (!Array.isArray(obj) || typeof key !== 'number' && isNaN(key as unknown as number)) { // not array
    // new key
    if (!(key in obj[isReactive])) {
      obj[isReactive][key] = [obj[key], new Set<Reactive>()]
      Object.defineProperty(obj, key, {
        get() { return this[isReactive][key][0] },
        set(value) {
          launch(this, this[isReactive][key] as PropertyTuple, value)
        }
      })
    }
    if (reactive) {
      for (let item of obj[isReactive][key][1]) {
        if (item[1] === reactive[1]) return
      }
      obj[isReactive][key][1].add(reactive)
    }
  } else { // array 何してる？
    let descriptor = Object.getOwnPropertyDescriptor(obj, key)
    if (!descriptor || 'value' in descriptor) {
      if (key in (obj[isReactive][arrayKey] as Array<unknown>)) {
        Object.defineProperty(obj, key, {
          get() { return this[isReactive][arrayKey][key] },
          set(value) {
            let old = this[isReactive][arrayKey][key]
            if (old !== value) {
              infect(this, value)
              purify(this, old)
              this[isReactive][arrayKey][key] = value
              obj[isReactive][recursiveKey][0][1]()
            }
          },
          configurable: true,
          enumerable: true
        })
      }
    }
  }
}

/**
 * Copy bio only
 */
function infect(obj: ReactiveObject, data: unknown)
{
  watch(data)
  obj[isReactive][recursiveKey][1].forEach(callback => watch(data, callback))
  return data
}

/**
 * Remove bio only
 */
function purify(obj: ReactiveObject, data: unknown)
{
  obj[isReactive][recursiveKey][1].forEach(callback => unreach(data, callback))
  return data
}


function launch(obj: ReactiveObject, property: PropertyTuple, value: unknown)
{
  let old = property[0]
  property[0] = value

  if (old !== value) {
    infect(obj, value)
    purify(obj, old)
    property[1].forEach(reactive => {
      switch(reactive[0]) {
        case 'bio':
          (reactive[1] as RecursiveCallback)()
          break
        // deno-lint-ignore no-fallthrough
        case 'bom':
          property[1].delete(reactive)
        case 'spy':
          reactive[1](value, old)
          break
      }
    })
  }
}