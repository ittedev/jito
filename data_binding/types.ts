// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export const dictionary = Symbol('Beako')
export const reactiveKey = Symbol('Reactive')
export const arrayKey = Symbol('Array')
export const isLocked = Symbol('Beako-lock')

export interface Dictionary {
  [key: string]: Page
  [key: symbol]: ReactiveTuple | Array<unknown>
}

export type Page = [unknown, Set<Arm>]

export type ReactiveTuple = [Bio, Set<ReactiveCallback>]

export type ArmType = 'bio' | 'spy' | 'bom'

export type Arm = [ArmType, Callback]
export type Bio = ['bio', ReactiveCallback]
export type Spy = ['spy', ChangeCallback]

export type ReactiveCallback = () => void
// deno-lint-ignore no-explicit-any
export type ChangeCallback = ((newValue: any, oldValue: any) => void)
export type Callback = ReactiveCallback | ChangeCallback

export interface BeakoObject {
  [key: string]: unknown
  [dictionary]: Dictionary
  [isLocked]: unknown
}
