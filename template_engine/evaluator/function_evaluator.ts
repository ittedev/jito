// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Evaluator, TermEvaluator, Variables } from '../types.ts'

export class FunctionEvaluator implements TermEvaluator<unknown> {
  constructor(
    private name: TermEvaluator<unknown>,
    private params: Array<TermEvaluator<unknown>>
  ) {}
  evalute(stack: Variables): unknown {
    const func = this.name.evalute(stack)
    if (typeof func === 'function') {
      return func(...this.params.map(param => param.evalute(stack)))
    }
    throw Error(this.name.toString() + ' is not a function')
  }
  optimize(): unknown | Evaluator<unknown> {
    this.name.optimize()
    this.params.forEach(param => param.optimize())
    return this
  }
  toString(): string {
    return this.name.toString() + '(...)'
  }
}
