// deno-lint-ignore-file no-explicit-any
export const dictionary = Symbol.for('Beako Dictionary')
export const reactiveKey = Symbol.for('Beako Reactive')
export const arrayKey = Symbol.for('Beako Array')
export const isLocked = Symbol.for('Beako Lock')

export interface Dictionary {
  [key: string]: PageTuple
  [reactiveKey]: RecursiveTuple
  [arrayKey]?: Array<unknown>
}

export type PageTuple = [unknown, Set<ArmTuple>]

export type RecursiveTuple = [BioTuple, Set<RecursiveCallback>]

export type ArmType = 'bio' | 'spy' | 'bom'

export type ArmTuple = [ArmType, Callback]
export type BioTuple = ['bio', RecursiveCallback]
export type SpyTuple = ['spy', TargetCallback]

export type RecursiveCallback = () => void
export type TargetCallback = ((newValue: any, oldValue: any) => void)
export type Callback = RecursiveCallback | TargetCallback

export interface BeakoObject {
  [key: string]: unknown
  [dictionary]: Dictionary
  [isLocked]: unknown
}
