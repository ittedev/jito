// deno-lint-ignore-file no-explicit-any
export const isReactive = Symbol.for('Jito Reactive')
export const isLocked = Symbol.for('Jito Lock')
export const recursiveKey = Symbol.for('Jito Recursive')
export const arrayKey = Symbol.for('Jito Array')

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
    !Object.isFrozen(object) &&
    !object[isLocked]
}
