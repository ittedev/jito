// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TermTemplate, Variables } from '../types.ts'

export class FunctionTemplate implements TermTemplate<unknown> {
  constructor(
    private name: TermTemplate<unknown>,
    private params: Array<TermTemplate<unknown>>
  ) {}
  evalute(stack: Variables): unknown {
    const func = this.name.evalute(stack)
    if (typeof func === 'function') {
      return func(...this.params.map(param => param.evalute(stack)))
    }
    throw Error(this.name.toString() + ' is not a function')
  }
  optimize(): unknown | Template<unknown> {
    this.name.optimize()
    this.params.forEach(param => param.optimize())
    return this
  }
  toString(): string {
    return this.name.toString() + '(...)'
  }
}
