// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, instanceOfTemplate, TermTemplate, Variables } from '../types.ts'

export class UnaryOperationTemplate implements TermTemplate<unknown> {
  constructor(
    private operator: string,
    private operand: TermTemplate<unknown>
  ) {}
  // deno-lint-ignore no-explicit-any
  static operate(operator: string, operand: any) {
    switch (operator) {
      case 'void': return void operand
      case 'typeof': return typeof operand
      case '+': return +operand
      case '-': return -operand
      case '~': return ~operand
      case '!': return !operand
      default: throw Error(operator + ' does not exist')
    }
  }
  evalute(stack: Variables): unknown {
    return UnaryOperationTemplate.operate(this.operator, this.operand.evalute(stack))
  }
  optimize(): unknown | Template<unknown> {
    const operand = this.operand.optimize()
    if (instanceOfTemplate(operand)) {
      return this
    } else {
      return UnaryOperationTemplate.operate(this.operator, operand)
    }
  }
  toString(): string {
    return '(' + this.operator + this.operand.toString() + ')'
  }
}
