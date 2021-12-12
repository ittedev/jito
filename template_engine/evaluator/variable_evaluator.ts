// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Evaluator, TermEvaluator, Variables } from '../types.ts'

export class VariableEvaluator implements TermEvaluator<unknown> {
  constructor(
    private name: string
  ) {}
  evalute(stack: Variables): unknown {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (this.name in stack[i]) return stack[i][this.name]
    }
    throw Error(this.name + ' is not defined')
  }
  optimize(): unknown | Evaluator<unknown> {
    return this
  }
  toString(): string {
    return this.name
  }
}
