export const dictionary = Symbol.for('Beako Dictionary')
export const reactiveKey = Symbol.for('Beako Reactive')
export const arrayKey = Symbol.for('Beako Array')
export const isLocked = Symbol.for('Beako Lock')

export interface Dictionary {
  [key: string]: Page
  [key: symbol]: ReactiveTuple | Array<unknown>
}

export type Page = [unknown, Set<Arm>]

export type ReactiveTuple = [Bio, Set<ReactiveCallback>]

export type ArmType = 'bio' | 'spy' | 'bom'

export type Arm = [ArmType, Callback]
export type Bio = ['bio', ReactiveCallback]
export type Spy = ['spy', TargetCallback]

export type ReactiveCallback = () => void
// deno-lint-ignore no-explicit-any
export type TargetCallback = ((newValue: any, oldValue: any) => void)
export type Callback = ReactiveCallback | TargetCallback

export interface BeakoObject {
  [key: string]: unknown
  [dictionary]: Dictionary
  [isLocked]: unknown
}
