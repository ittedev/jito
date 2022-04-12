// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Variables } from './types.ts'
import { pickup } from './pickup.ts'

export class Loop
{
  constructor(
    private _key: unknown,
    private _value: unknown,
    private _index: number,
    private _entries: Array<[unknown, unknown]>,
    private _stack: Variables
  )
  {}

  get key(): unknown { return this._key }
  get value(): unknown { return this._value }
  get index(): number { return this._index }
  get size(): number { return this._entries.length }
  get isFirst(): boolean { return this._index === 0 }
  get isLast(): boolean { return this._index === this._entries.length - 1 }
  get parent(): Loop | undefined
  {
    return pickup(this._stack, 'loop')[0] as Loop | undefined
  }

  toJSON() {
    return {
      key: this._key,
      value: this._value,
      _index: this._index,
      size: this._entries.length,
      isFirst: this._index === 0,
      isLast: this._index === this._entries.length - 1
    }
  }
  // There are not supported.
  // get iteration(): number { return this._index + 1 }
  // get remaining(): number { return this._entries.length - this._index }
}