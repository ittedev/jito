// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TermTemplate, Variables } from '../types.ts'

export class VariableTemplate implements TermTemplate<unknown> {
  constructor(
    private name: string
  ) {}
  evalute(stack: Variables): unknown {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (this.name in stack[i]) return stack[i][this.name]
    }
    throw Error(this.name + ' is not defined')
  }
  optimize(): unknown | Template<unknown> {
    return this
  }
  toString(): string {
    return this.name
  }
}
