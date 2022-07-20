// deno-lint-ignore-file no-explicit-any
export const isReactive = Symbol.for('Beako Reactive')
export const isLocked = Symbol.for('Beako Lock')
export const recursiveKey = Symbol.for('Beako Recursive')
export const arrayKey = Symbol.for('Beako Array')

export interface ReactiveDictionary {
  [key: string]: PropertyTuple
  [recursiveKey]: RecursiveTuple
  [arrayKey]?: Array<unknown>
}

export type PropertyTuple = [
  unknown, // property data
  Set<Reactive>
]

export type RecursiveTuple = [
  RecursiveReactive, // same RecursiveReactive in all property
  Set<RecursiveCallback>
]

export type ReactiveType =
  'bio' | // RecursiveReactive
  'spy' | // TargetReactive
  'bom' // only once Reactive

export type Reactive = [ReactiveType, Callback]
export type RecursiveReactive = ['bio', RecursiveCallback]
export type TargetReactive = ['spy', TargetCallback]

export type RecursiveCallback = () => void
export type TargetCallback = ((newValue: any, oldValue: any) => void)
export type Callback = RecursiveCallback | TargetCallback


export interface ReactivableObject {
  [key: string]: unknown
  [isReactive]?: ReactiveDictionary
}

export interface ReactiveObject extends ReactivableObject {
  [key: string]: unknown
  [isReactive]: ReactiveDictionary
  [isLocked]?: boolean
}

export function instanceOfReactivableObject(object: any): object is ReactivableObject {
  return typeof object === 'object' &&
    object !== null &&
    (Object.getPrototypeOf(object) === Object.prototype || Array.isArray(object)) &&
    !object[isLocked]
}
