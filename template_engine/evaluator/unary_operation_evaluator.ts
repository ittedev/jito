// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Evaluator, instanceOfEvaluator, TermEvaluator, Variables } from '../types.ts'

export class UnaryOperationEvaluator implements TermEvaluator<unknown> {
  constructor(
    private operator: string,
    private operand: TermEvaluator<unknown>
  ) {}
  static operate(operator: string, operand: unknown) {
    switch (operator) {
      case 'void': return void(operand)
      case 'typeof': return typeof(operand)
      case '+': return +(operand as number)
      case '-': return -(operand as number)
      case '~': return ~(operand as number)
      case '!': return !(operand)
      default: throw Error(operator + ' does not exist')
    }
  }
  evalute(stack: Variables): unknown {
    return UnaryOperationEvaluator.operate(this.operator, this.operand.evalute(stack))
  }
  optimize(): unknown | Evaluator<unknown> {
    const operand = this.operand.optimize()
    if (instanceOfEvaluator(operand)) {
      return this
    } else {
      return UnaryOperationEvaluator.operate(this.operator, operand)
    }
  }
  toString(): string {
    return '(' + this.operator + this.operand.toString() + ')'
  }
}
