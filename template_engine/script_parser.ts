// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Template,
  LiteralTemplate,
  ArrayTemplate,
  ObjectTemplate,
  VariableTemplate,
  UnaryTemplate,
  BinaryTemplate,
  AssignTemplate,
  FunctionTemplate,
  HashTemplate,
  GetTemplate,
  JoinTemplate,
  IfTemplate,
  Token,
  TokenField,
  TokenType
} from './types.ts'
import { Lexer } from './lexer.ts'

export function innerText(lexer: Lexer): Template | string {
  const texts = [] as Array<string | Template>
  texts.push(lexer.skip())
  while (lexer.nextType()) {
    if (lexer.nextType() === '{{') {
      lexer.pop()
      lexer.expand('script', () => {
        texts.push(expression(lexer))
      })
      must(lexer.pop(), '}}')
      texts.push(lexer.skip())
    } else {
      lexer.pop()
    }
  }

  // optimize
  const values = texts.filter(value => value !== '')
  if (values.length === 1 && typeof values[0] === 'string') {
    return values[0]
  } else {
    return { type: 'join', values, separator: '' } as JoinTemplate
  }
}

/**
 * E = I
 * Operator precedence
 * used: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 * @alpha
 */
export function expression(lexer: Lexer): Template {
  return assignment(lexer)
}

/**
 * Assignment
 * I = C o E
 * Precedence: 2
 * @alpha
 */
function assignment(lexer: Lexer): Template {
  const left = conditional(lexer)
  if (lexer.nextType() === 'assign') {
    if (left.type !== 'get') {
      throw Error('The left operand is not variable')
    }
    const operator = (lexer.pop() as Token)[1]
    const right = expression(lexer)
    return { type: 'assign', operator, left: (left as GetTemplate).value, right } as AssignTemplate
  } else {
    return left
  }
}

/**
 * C = A (? E : A)*
 * Precedence: 3
 * @alpha
 */
function conditional(lexer: Lexer): Template {
  let condition = arithmetic(lexer)
  while (lexer.nextType() === '?') {
    lexer.pop()
    const truthy = expression(lexer)
    must(lexer.pop(), ':')
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
  while(lexer.nextType() === 'multi' || lexer.nextType() === 'binary') {
    list.push((lexer.pop() as Token)[1])
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
    case 'multi': 
    case 'unary':
      return { type: 'unary', operator: (lexer.pop() as Token)[1] as string, operand:unary(lexer) } as UnaryTemplate
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
      case '(': {
        lexer.pop()
        const params = [] as Array<Template>
        while (lexer.nextType() !== ')') {
          params.push(expression(lexer))
          if (lexer.nextType() === ',') lexer.pop()
          else break
        }
        must(lexer.pop(), ')')
        template = { type: 'function', name: template, params } as FunctionTemplate
        continue
      }
      case '.': {
        lexer.pop()
        const key = lexer.pop() as Token
        must(key, 'word')
        
        template = { type: 'get', value: { type: 'hash', object: template, key: { type: 'literal', value: key[1] } as LiteralTemplate } as HashTemplate } as GetTemplate
        continue
      }
      case '[': {
        lexer.pop()
        const key = expression(lexer)
        must(lexer.pop(), ']')
        template = { type: 'get', value: { type: 'hash', object: template, key } as HashTemplate } as GetTemplate
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
  switch (token[0]) {
    // w
    case 'word':
      return { type: 'get', value: { type: 'variable', name: token[1] } as VariableTemplate } as GetTemplate

    // L = n | s | b | undefined | null
    
    case 'number': return { type: 'literal', value: Number(token[1]) } as LiteralTemplate
    case 'boolean': return { type: 'literal', value: token[1] === 'true' ? true : false } as LiteralTemplate
    case 'undefined': return { type: 'literal', value: undefined } as LiteralTemplate
    case 'null': return { type: 'literal', value: null } as LiteralTemplate
    case '"': return stringLiteral(lexer, 'doubleString', token[0])
    case "'": return stringLiteral(lexer, 'singleString', token[0])
    case '`': return stringLiteral(lexer, 'template', token[0])

    // (E)
    case '(': {
      const node = expression(lexer)
      must(lexer.pop(), ')')
      return node
    }

    // a = [E, ...]
    case '[': {
      const values = []
      while(lexer.nextType() !== ']') {
        values.push(expression(lexer))
        if (lexer.nextType() === ',') {
          lexer.pop()
        } else if (lexer.nextType() === ']') {
          lexer.pop()
          break
        } else {
          throw Error("']' is required")
        }
      }
      return { type: 'array', values } as ArrayTemplate
    }

    // r = { w, w: E, [E]: E, ...}
    case '{': {
      const entries = [] as Array<[Template, Template]>
      while(lexer.nextType() !== '}') {
        const entry = Array(2) as [Template, Template]
        const token = lexer.pop() as Token
        if (token[0] === 'word') {
          entry[0] = { type: 'literal', value: token[1] } as LiteralTemplate
        } else if (token[0] === '[') {
          entry[0] = expression(lexer)
          must(lexer.pop(), ']')
        }
        if (token[0] === 'word' && (lexer.nextType() === ',' || lexer.nextType() === '}')) {
          entry[1] = { type: 'get', value: { type: 'variable', name: token[1] } as VariableTemplate } as GetTemplate
        } else {
          must(lexer.pop(), ':')
          entry[1] = expression(lexer)
        }
        entries.push(entry)
        if (lexer.nextType() === ',') {
          lexer.pop()
        } else if (lexer.nextType() === '}') {
          lexer.pop()
          break
        } else {
          throw Error("'}' is required")
        }
      }
      return { type: 'object', entries } as ObjectTemplate
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
      switch (token[0]) {
        case type: break loop
        case 'return': throw Error()
        case 'escape':
          texts[i] += token[1] // TODO: escape char
          continue
        case '${':
          lexer.expand('script', () => {
            texts.push(expression(lexer))
          })
          must(lexer.pop(), '}')
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

function must(token: Token | null, type: TokenType, message = ''): void {
  if (!token || token[0] !== type) throw Error(message)
}
