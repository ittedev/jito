// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export const dictionary = Symbol('Beako')
export const isLocked = Symbol('Beako-lock')

export interface Dictionary {
  [key: string]: Page
}

export interface Page {
  value: unknown
  arms: Set<Arm>
}

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
