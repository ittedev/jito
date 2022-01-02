// deno-lint-ignore-file no-explicit-any
import { Ref } from './types.ts'

export function operateUnary(operator: string, operand: any) {
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

export function operateBinary(operator: string, left: any, right: any) {
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

