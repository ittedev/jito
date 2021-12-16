// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, Token, TokenField, TokenType } from '../types.ts'
import { Lexer } from '../lexer/mod.ts'
import {
  JoinTemplate,
  LiteralTemplate,
  VariableTemplate,
  FunctionTemplate,
  HashTemplate,
  UnaryOperationTemplate,
  BinaryOperationTemplate,
  TernaryOperationTemplate
} from '../template/mod.ts'

function must(token: Token | null, type: TokenType, message = ''): void {
  if (!token || token.type !== type) throw new Error(message)
}


export function innerText(lexer: Lexer): Template<string> {
  const texts = [] as Array<string | Template<unknown>>
  texts.push(lexer.skip())
  while (lexer.nextType()) {
    if (lexer.nextType() === TokenType.leftMustache) {
      lexer.pop()
      lexer.expand(TokenField.script, () => {
        texts.push(expression(lexer))
      })
      must(lexer.pop(), TokenType.rightMustache)
      texts.push(lexer.skip())
    } else {
      lexer.pop()
    }
  }
  return new JoinTemplate(texts.filter(value => value !== ''))

}

/**
 * E = C
 * Operator precedence
 * used: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 * @alpha
 */
export function expression(lexer: Lexer): Template<unknown> {
  return conditional(lexer)
}

/**
 * C = A (? E : A)*
 * Precedence: 3
 * @alpha
 */
// 
function conditional(lexer: Lexer): Template<unknown> {
  let template = arithmetic(lexer)
  while (lexer.nextType() === TokenType.question) {
    lexer.pop()
    const truthy = expression(lexer)
    must(lexer.pop(), TokenType.colon)
    const falsy = arithmetic(lexer)
    template =  new TernaryOperationTemplate(template, truthy, falsy)
  }
  return template
}

/**
 * A = U(oU)*
 * Precedence: 4 - 14
 * @alpha
 */
 function arithmetic(lexer: Lexer): Template<unknown> {
  const list = new Array<Template<unknown> | string>()
  list.push(unary(lexer))
  while(lexer.nextType() === TokenType.multiOpetator || lexer.nextType() === TokenType.binaryOpetator) {
    list.push((lexer.pop() as Token).value)
    list.push(unary(lexer))
  }

  // Binary operator precedence
  while (list.length > 1) {
    for (let index = 0; index + 1 < list.length; index += 2) {
      if (index + 3 >= list.length || precedence(list[index + 1] as string) > precedence(list[index + 3] as string)) {
        const node = new BinaryOperationTemplate(list[index + 1] as string, list[index] as Template<unknown>, list[index + 2] as Template<unknown>)
        list.splice(index, 3, node)
      }
    }
  }

  return typeof list[0] === 'string' ? new VariableTemplate(list[0]) : list[0] as Template<unknown>
}

function precedence(operator: string): number {
  switch (operator) {
    default: return 0
    case '||': case '??': return 4
    case '&&': return 5
    case '|': return 6
    case '^': return 7
    case '&': return 8
    case '==': case '!=': case '===': case '!==': return 9
    case 'in': case 'instanceof': case '<': case '>': case '<=': case '>=': return 10
    case '<<': case '>>': case '>>>': return 11
    case '+': case '-': return 12
    case '*': case '/': case '%': return 13
    case '**': return 14
  }
}

/**
 * U = oU | F
 * Precedence: 15
 * @alpha
 */
function unary(lexer: Lexer): Template<unknown> {
  switch (lexer.nextType()) {
    case TokenType.multiOpetator: 
    case TokenType.exclamation:
      return new UnaryOperationTemplate(lexer.pop()?.value as string, unary(lexer))
    default:
      return func(lexer)
  }
}

/**
 * F = T( (E, ..E*) | [E] | .w )*
 * Precedence: 18
 * @alpha
 */
function func(lexer: Lexer): Template<unknown> {
  let template = term(lexer)
  while (true) {
    switch (lexer.nextType()) {
      case TokenType.leftRound: {
        lexer.pop()
        const params = [] as Array<Template<unknown>>
          while (lexer.nextType() !== TokenType.rightRound) {
          params.push(expression(lexer))
          if (lexer.nextType() === TokenType.comma) lexer.pop()
          else break
        }
        must(lexer.pop(), TokenType.rightRound)
        template = new FunctionTemplate(template, params)
        continue
      }
      case TokenType.chaining: {
        lexer.pop()
        const key = lexer.pop() as Token
        must(key, TokenType.word)
        template = new HashTemplate(template, new LiteralTemplate(key.value))
        continue
      }
      case TokenType.leftSquare: {
        lexer.pop()
        const key = expression(lexer)
        must(lexer.pop(), TokenType.rightSquare)
        template = new HashTemplate(template, key)
        continue
      }
    }
    break
  }
  return template
}

/**
 * T = w | L | (E)
 * Precedence: 19
 * @alpha
 */
function term(lexer: Lexer): Template<unknown> {
  const token = lexer.pop() as Token
  switch (token.type) {
    // w
    case TokenType.word:
      return new VariableTemplate(token.value)

    // L = n | s | b | undefined | null
    case TokenType.number: return new LiteralTemplate(Number(token.value))
    case TokenType.boolean: return new LiteralTemplate(token.value === 'true' ? true : false)
    case TokenType.undefined: return new LiteralTemplate(undefined)
    case TokenType.null: return new LiteralTemplate(null)
    case TokenType.doubleQuote: return stringLiteral(lexer, TokenField.doubleString, token.type)
    case TokenType.singleQuote: return stringLiteral(lexer, TokenField.singleString, token.type)
    case TokenType.backQuote: return stringLiteral(lexer, TokenField.template, token.type)

    // (E)
    case TokenType.leftRound: {
      const node = expression(lexer)
      must(lexer.pop(), TokenType.rightRound)
      return node
    }
    default: throw new Error(JSON.stringify(token))
  }
}

/**
 * String Literal
 * @alpha
 */
function stringLiteral(lexer: Lexer, field: TokenField, type: TokenType): Template<unknown> {
  const texts = [''] as Array<string | Template<unknown>>
  let i = 0
  lexer.expand(field, () => {
    loop: while (true) {
      texts[i] += lexer.skip()
      const token = lexer.pop() as Token
      switch (token.type) {
        case type: break loop
        case TokenType.return: throw Error()
        case TokenType.escape:
          texts[i] += token.value // TODO: escape char
          continue
        case TokenType.leftPlaceHolder:
          lexer.expand(TokenField.script, () => {
            texts.push(expression(lexer))
          })
          must(lexer.pop(), TokenType.rightPlaceHolder)
          texts.push(lexer.skip())
          i += 2
      }
    }
  })
  if (i === 0) {
    return new LiteralTemplate(texts[0])
  } else {
    return new JoinTemplate(texts.filter(value => value !== ''))
  }
}
