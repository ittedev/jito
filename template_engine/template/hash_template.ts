// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TermTemplate, Variables } from '../types.ts'

export class HashTemplate implements TermTemplate<unknown> {
  constructor(
    private obj: TermTemplate<unknown>,
    private key: TermTemplate<unknown>
  ) {}
  evalute(stack: Variables): unknown {
    return (this.obj.evalute(stack) as Record<PropertyKey, unknown>)[this.key.evalute(stack) as PropertyKey]
  }
  optimize(): unknown | Template<unknown> {
    this.obj.optimize()
    this.key.optimize()
    return this
  }
  toString(): string {
    return this.obj.toString() + '[' + this.key.toString() + ']'
  }
}
