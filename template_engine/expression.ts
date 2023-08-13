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
  RegexTemplate,
  Token,
  TokenField,
  TokenType
} from './types.ts'
import { Lexer, unescape } from './lexer.ts'

/**
 * E = I
 * Operator precedence
 * used: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
export function expression(script: string): Template
export function expression(lexer: Lexer): Template
export function expression(script: Lexer | string): Template
{
  let lexer = typeof script === 'string' ? new Lexer(script, 'script') : script
  return assignment(lexer)
}

/**
 * Assignment
 * I = C o E
 * Precedence: 2
 */
function assignment(lexer: Lexer): Template
{
  let left = conditional(lexer)
  if (lexer.nextIs('assign')) {
    if (left.type !== 'get') {
      throw Error('The left operand is not variable')
    }
    let operator = (lexer.pop() as Token)[1]
    let right = expression(lexer)
    return {
      type: 'assign',
      operator,
      left: (left as GetTemplate).value,
      right
    } as AssignTemplate
  } else {
    return left
  }
}

/**
 * C = A (? E : A)*
 * Precedence: 3
 */
function conditional(lexer: Lexer): Template
{
  let condition = arithmetic(lexer)
  while (lexer.nextIs('?')) {
    lexer.pop()
    let truthy = expression(lexer)
    lexer.must(':')
    let falsy = arithmetic(lexer)
    condition = { type: 'if', condition, truthy, falsy } as IfTemplate
  }
  return condition
}

/**
 * A = U(oU)*
 * Precedence: 4 - 14
 */
function arithmetic(lexer: Lexer): Template
{
  let list = new Array<Template | string>()
  list.push(unary(lexer))
  while(lexer.nextIs('multi') || lexer.nextIs('binary') || lexer.nextIs('/')) {
    list.push((lexer.pop() as Token)[1])
    list.push(unary(lexer))
  }

  // Binary operator precedence
  while (list.length > 1) {
    for (let index = 0; index + 1 < list.length; index += 2) {
      if (
        index + 3 >= list.length ||
        precedence(list[index + 1] as string) > precedence(list[index + 3] as string)
      ) {
        let node = {
          type: 'binary',
          operator: list[index + 1] as string,
          left: list[index] as Template,
          right: list[index + 2] as Template
        } as BinaryTemplate
        list.splice(index, 3, node)
      }
    }
  }

  return typeof list[0] === 'string' ?
    { type: 'variable', name: list[0] } as VariableTemplate :
    list[0] as Template
}

function precedence(operator: string): number
{
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
 * U = oU | P
 * Precedence: 15
 */
function unary(lexer: Lexer): Template
{
  switch (lexer.nextIs()) {
    case 'multi':
    case 'unary':
      return {
        type: 'unary',
        operator: (lexer.pop() as Token)[1],
        operand: unary(lexer)
      } as UnaryTemplate
    case 'crement': // prefix
      return {
        type: 'assign',
        operator: (lexer.pop() as Token)[1].charAt(0) + '=',
        left: (unary(lexer) as GetTemplate).value,
        right: { type: 'literal', value: 1 }
      } as AssignTemplate
    default:
      return postfix(lexer)
  }
}

/**
 * P = Fo
 * Precedence: 16
 */
function postfix(lexer: Lexer): Template
{
  let template = func(lexer)
  if(lexer.nextIs('crement')) {
    return {
      type: 'assign',
      operator: (lexer.pop() as Token)[1].charAt(0) + '=',
      left: (template as GetTemplate).value,
      right: { type: 'literal', value: 1 },
      prevalue: true
    } as AssignTemplate
  }
  return template
}

/**
 * F = T( (E, ..E*) | [E] | .w )*
 * Precedence: 18
 * @alpha
 */
function func(lexer: Lexer): Template
{
  let template = term(lexer)
  while (true) {
    switch (lexer.nextIs()) {
      case '(': {
        lexer.pop()
        let params = [] as Array<Template>
        while (!lexer.nextIs(')')) {
          params.push(expression(lexer))
          if (lexer.nextIs(',')) lexer.pop()
          else break
        }
        lexer.must(')')
        template = { type: 'function', name: template, params } as FunctionTemplate
        continue
      }
      case '.': {
        lexer.pop()
        let key = lexer.must('word')
        template = { type: 'get', value: { type: 'hash', object: template, key: { type: 'literal', value: key[1] } as LiteralTemplate } as HashTemplate } as GetTemplate
        continue
      }
      case '[': {
        lexer.pop()
        let key = expression(lexer)
        lexer.must(']')
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
 */
function term(lexer: Lexer): Template
{
  let token = lexer.pop() as Token
  switch (token[0]) {
    // w
    case 'word':
      return { type: 'get', value: { type: 'variable', name: token[1] } as VariableTemplate } as GetTemplate

    // L = n | s | b | undefined | null

    case 'number': return { type: 'literal', value: Number(token[1]) } as LiteralTemplate
    case 'boolean': return { type: 'literal', value: token[1] === 'true' ? true : false } as LiteralTemplate
    case 'undefined': return { type: 'literal', value: undefined } as LiteralTemplate
    case 'null': return { type: 'literal', value: null } as LiteralTemplate
    case '"': return stringLiteral(lexer, 'double', token[0])
    case "'": return stringLiteral(lexer, 'single', token[0])
    case '`': return stringLiteral(lexer, 'template', token[0])
    case '/': return regexLiteral(lexer)

    // (E)
    case '(': {
      let node = expression(lexer)
      lexer.must(')')
      return node
    }

    // a = [E, ...]
    case '[': {
      let values = []
      while(!lexer.nextIs(']')) {
        values.push(expression(lexer))
        if (lexer.nextIs(',')) {
          lexer.pop()
        } else if (lexer.nextIs(']')) {
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
      let entries = [] as Array<[Template, Template]>
      while(!lexer.nextIs('}')) {
        let entry = Array(2) as [Template, Template]
        let token = lexer.pop() as Token
        if (token[0] === 'word') {
          entry[0] = { type: 'literal', value: token[1] } as LiteralTemplate
        } else if (token[0] === '"') {
          entry[0] = stringLiteral(lexer, 'double', token[0])
        } else if (token[0] === "'") {
          entry[0] = stringLiteral(lexer, 'single', token[0])
        } else if (token[0] === '[') {
          entry[0] = expression(lexer)
          lexer.must(']')
        }
        if (token[0] === 'word' && (lexer.nextIs(',') || lexer.nextIs('}'))) {
          entry[1] = { type: 'get', value: { type: 'variable', name: token[1] } as VariableTemplate } as GetTemplate
        } else {
          lexer.must(':')
          entry[1] = expression(lexer)
        }
        entries.push(entry)
        if (lexer.nextIs(',')) {
          lexer.pop()
        } else if (lexer.nextIs('}')) {
          break
        } else {
          throw Error("'}' is required")
        }
      }
      lexer.pop()
      return { type: 'object', entries } as ObjectTemplate
    }

    default: throw new Error(token[0] + ' is invalid')
  }
}

/**
 * String Literal
 */
export function stringLiteral(
  lexer: Lexer,
  field: TokenField,
  type: TokenType
): Template
{
  let texts = [''] as Array<string | Template>
  let i = 0
  lexer.expand(field, () => {
    loop: while (true) {
      texts[i] += lexer.skip()
      let token = lexer.pop() as Token
      switch (token[0]) {
        case type: break loop
        case 'return': throw Error('Newline cannot be used')
        case 'escape':
          texts[i] += unescape(token[1])
          continue
        case '${':
          lexer.expand('script', () => {
            texts.push(expression(lexer))
          })
          lexer.must('}')
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

export function regexLiteral(lexer: Lexer): Template
{
  let template = { type: 'regex', value: '' } as RegexTemplate
  lexer.expand('regex', () => {
    loop: while (true) {
      template.value += lexer.skip()
      let token = lexer.pop() as Token
      switch (token[0]) {
        case '/': break loop
        case 'flags':
        case 'string':
          template.value += token[1]
          break
      }
    }
    if (lexer.nextIs('flags')) {
      template.flags = (lexer.pop() as Token)[1]
    }
  })
  return template
}
