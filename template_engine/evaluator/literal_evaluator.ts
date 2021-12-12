// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Evaluator, TermEvaluator, Variables } from '../types.ts'

export class LiteralEvaluator implements TermEvaluator<unknown> {
  constructor(
    private value: unknown
  ) {}
  evalute(_stack: Variables): unknown {
    return this.value
  }
  optimize(): unknown | Evaluator<unknown> {
    return this.value
  }
  toString(): string {
    return typeof this.value === 'string' ? '"' + this.value + '"' : String(this.value)
  }
}
