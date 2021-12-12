// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Evaluator, instanceOfEvaluator, TermEvaluator, Variables } from '../types.ts'

export class BinaryOperationEvaluator implements TermEvaluator<unknown> {
  constructor(
    private operator: string,
    private left: TermEvaluator<unknown>,
    private right: TermEvaluator<unknown>
  ) {}
  // deno-lint-ignore no-explicit-any
  static operate(operator: string, left: any, right: any) {
    switch (operator) {
      // Arithmetic operators
      case '+': return left + right
      case '-': return left - right
      case '/': return left / right
      case '*': return left * right
      case '%': return left % right
      case '**': return left ** right

      // Relational operators
      case 'in': return left in right
      case 'instanceof': return left instanceof right
      case '<': return left < right
      case '>': return left > right
      case '<=': return left <= right
      case '>=': return left >= right

      // Equality operators
      case '==': return left == right
      case '!=': return left != right
      case '===': return left === right
      case '!==': return left !== right

      // Bitwise shift operators
      case '<<': return left << right
      case '>>': return left >> right
      case '>>>': return left >>> right

      // Binary bitwise operators
      case '&': return left & right
      case '|': return left | right
      case '^': return left ^ right

      // Binary logical operators
      case '&&': return left && right
      case '||': return left || right
      case '??': return left ?? right
      
      // Other operators
      default: throw Error(operator + ' does not exist')
    }
  }
  evalute(stack: Variables): unknown {
    return BinaryOperationEvaluator.operate(this.operator, this.left.evalute(stack), this.right.evalute(stack))
  }
  optimize(): unknown | Evaluator<unknown> {
    const left = this.left.optimize()
    const right = this.right.optimize()
    if (instanceOfEvaluator(left) && instanceOfEvaluator(right)) {
      return this
    } else {
      return BinaryOperationEvaluator.operate(this.operator, left, right)
    }
  }
  toString(): string {
    return '(' + this.left.toString() + ' ' + this.operator +  ' ' + this.right.toString() + ')'
  }
}
