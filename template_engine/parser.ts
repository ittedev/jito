// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Template,
  LiteralTemplate,
  VariableTemplate,
  UnaryTemplate,
  BinaryTemplate,
  FunctionTemplate,
  HashTemplate,
  JoinTemplate,
  IfTemplate,
  Token,
  TokenField,
  TokenType
} from './types.ts'
import { Lexer } from './lexer.ts'

function must(token: Token | null, type: TokenType, message = ''): void {
  if (!token || token.type !== type) throw Error(message)
}

export function innerText(lexer: Lexer): Template {
  const texts = [] as Array<string | Template>
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
  
  return { type: 'join', values: texts.filter(value => value !== ''), separator: '' } as JoinTemplate
}

/**
 * E = C
 * Operator precedence
 * used: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 * @alpha
 */
export function expression(lexer: Lexer): Template {
  return conditional(lexer)
}

/**
 * C = A (? E : A)*
 * Precedence: 3
 * @alpha
 */
// 
function conditional(lexer: Lexer): Template {
  let condition = arithmetic(lexer)
  while (lexer.nextType() === TokenType.question) {
    lexer.pop()
    const truthy = expression(lexer)
    must(lexer.pop(), TokenType.colon)
    const falsy = arithmetic(lexer)
    condition = { type: 'if', condition, truthy, falsy } as IfTemplate
  }
  return condition
}

/**
 * A = U(oU)*
 * Precedence: 4 - 14
 * @alpha
 */
 function arithmetic(lexer: Lexer): Template {
  const list = new Array<Template | string>()
  list.push(unary(lexer))
  while(lexer.nextType() === TokenType.multiOpetator || lexer.nextType() === TokenType.binaryOpetator) {
    list.push((lexer.pop() as Token).value)
    list.push(unary(lexer))
  }

  // Binary operator precedence
  while (list.length > 1) {
    for (let index = 0; index + 1 < list.length; index += 2) {
    if (index + 3 >= list.length || precedence(list[index + 1] as string) > precedence(list[index + 3] as string)) {
        const node = { type: 'binary', operator: list[index + 1] as string, left:list[index] as Template, right: list[index + 2] as Template } as BinaryTemplate
        list.splice(index, 3, node)
      }
    }
  }

  return typeof list[0] === 'string' ? { type: 'variable', name: list[0] } as VariableTemplate : list[0] as Template
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
function unary(lexer: Lexer): Template {
  switch (lexer.nextType()) {
    case TokenType.multiOpetator: 
    case TokenType.exclamation:
      return { type: 'unary', operator: lexer.pop()?.value as string, operand:unary(lexer) } as UnaryTemplate
    default:
      return func(lexer)
  }
}

/**
 * F = T( (E, ..E*) | [E] | .w )*
 * Precedence: 18
 * @alpha
 */
function func(lexer: Lexer): Template {
  let template = term(lexer)
  while (true) {
    switch (lexer.nextType()) {
      case TokenType.leftRound: {
        lexer.pop()
        const params = [] as Array<Template>
          while (lexer.nextType() !== TokenType.rightRound) {
          params.push(expression(lexer))
          if (lexer.nextType() === TokenType.comma) lexer.pop()
          else break
        }
        must(lexer.pop(), TokenType.rightRound)
        template = { type: 'function', name: template, params } as FunctionTemplate
        continue
      }
      case TokenType.chaining: {
        lexer.pop()
        const key = lexer.pop() as Token
        must(key, TokenType.word)
        
        template = { type: 'hash', object: template, key: { type: 'literal', value: key.value } as LiteralTemplate } as HashTemplate
        continue
      }
      case TokenType.leftSquare: {
        lexer.pop()
        const key = expression(lexer)
        must(lexer.pop(), TokenType.rightSquare)
        template = { type: 'hash', object: template, key } as HashTemplate
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
function term(lexer: Lexer): Template {
  const token = lexer.pop() as Token
  switch (token.type) {
    // w
    case TokenType.word:
      return { type: 'variable', name: token.value } as VariableTemplate

    // L = n | s | b | undefined | null
    
    case TokenType.number: return { type: 'literal', value: Number(token.value) } as LiteralTemplate
    case TokenType.boolean: return { type: 'literal', value: token.value === 'true' ? true : false } as LiteralTemplate
    case TokenType.undefined: return { type: 'literal', value: undefined } as LiteralTemplate
    case TokenType.null: return { type: 'literal', value: null } as LiteralTemplate
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
function stringLiteral(lexer: Lexer, field: TokenField, type: TokenType): Template {
  const texts = [''] as Array<string | Template>
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
    return { type: 'literal', value: texts[0] } as LiteralTemplate
  } else {
    return { type: 'join', values: texts.filter(value => value !== ''), separator: '' } as JoinTemplate
  }
}
