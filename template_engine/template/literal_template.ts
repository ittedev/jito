// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TermTemplate, Variables } from '../types.ts'

export class LiteralTemplate implements TermTemplate<unknown> {
  constructor(
    private value: unknown
  ) {}
  evalute(_stack: Variables): unknown {
    return this.value
  }
  optimize(): unknown | Template<unknown> {
    return this.value
  }
  toString(): string {
    return typeof this.value === 'string' ? '"' + this.value + '"' : String(this.value)
  }
}
