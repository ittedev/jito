// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, instanceOfTemplate, TermTemplate, Variables } from '../types.ts'

export class BinaryOperationTemplate implements TermTemplate<unknown> {
  constructor(
    private operator: string,
    private left: TermTemplate<unknown>,
    private right: TermTemplate<unknown>
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
    return BinaryOperationTemplate.operate(this.operator, this.left.evalute(stack), this.right.evalute(stack))
  }
  optimize(): unknown | Template<unknown> {
    const left = this.left.optimize()
    const right = this.right.optimize()
    if (instanceOfTemplate(left) && instanceOfTemplate(right)) {
      return this
    } else {
      return BinaryOperationTemplate.operate(this.operator, left, right)
    }
  }
  toString(): string {
    return '(' + this.left.toString() + ' ' + this.operator +  ' ' + this.right.toString() + ')'
  }
}
