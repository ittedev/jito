// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { TokenField, TokenType, Token } from './types.ts'

function distinguish(field: TokenField, value: string): TokenType {
  switch (field) {
    case 'script':
      switch (value) {
        case '+': case '-':
          return 'multi'

        case 'void': case 'typeof': case '~': case '!':
          return 'unary'

        case '/': case '*': case '%': case '**': // Arithmetic operators
        case 'in': case 'instanceof': case '<': case '>': case '<=': case '>=': // Relational operators
        case '==': case '!=': case '===': case '!==': // Equality operators
        case '<<': case '>>': case '>>>': // Bitwise shift operators
        case '&': case '|': case '^': // Binary bitwise operators
        case '&&': case '||': case '??': // Binary logical operators
          return 'binary'

        case '=': case '*=': case '**=': case '/=': case '%=': case '+=': case '-=':
        case '<<=': case '>>=': case '>>>=': case '&=': case '^=': case '|=':
        case '&&=': case '||=': case '??=':
          return 'assign'

        case '++': case '--':
          return 'crement'

        case 'false': case 'true':
          return 'boolean'

        case 'null': case 'undefined':
        case '.': case '?.':
        case '[': case ']': case '{': case '}': case '(': case ')':
        case '...': case '?': case ':': case ',':
        case "'": case '"': case '`':
          return value
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return 'lineComment'
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value): return 'word'
        case /^\d+\.?\d*$|^\.?\d+$/.test(value): return 'number' // TODO: lex number
      }
      break
    // deno-lint-ignore no-fallthrough
    case 'template':
      switch (value) {
        case '$': return 'partial'
        case '${': return value
        case '}': return value
        case '`': return '`'
        case '\r': case '\n': case '\r\n':
          return 'other'
      }
    case 'singleString':
    case 'doubleString':
      switch (value) {
        case '\\': return 'partial'
        case '\r': case '\n': case '\r\n': return 'return'
        case '\\\r\n': return 'escape'
        case '\'':
          if (field === 'singleString') return value
          break
        case '\"':
          if (field === 'doubleString') return value
          break
      }
      switch (true) {
        case /^\\(x|u)$/.test(value): return 'partial'
        case /^\\.$/.test(value): return 'escape' // TODO: lex unicode
      }
      break
    case 'text':
      switch (value) {
        case '{': case '}': return 'partial'
        case '{{': case '}}': return value
      }
      break
  }
  return 'other'
}

export class Lexer {
  constructor(
    private text: string,
    private field: TokenField,
    private index = 0,
    private token: Token | null = null
  ) {}
  private _next(start: number): Token | null {
    const token = ['', '']
    for (this.index = start; this.index < this.text.length; this.index++) {
      const nextType = distinguish(this.field, token[1] + this.text[this.index])
      if (nextType === 'other') {
        return token as Token
      } else {
        token[0] = nextType
        token[1] = token[1] + this.text[this.index]
      }
    }
    return token as Token
  }
  skip(): string {
    let value = ''
    if (!this.token) {
      for (let i = this.index; i < this.text.length; i++) {
        if (distinguish(this.field, this.text[i]) === 'other') {
          value += this.text[i]
        } else {
          this.token = this._next(i)
          if (this.token && this.token[0] === 'partial') {
            value += this.token[1]
            this.token = null
          } else {
            return value
          }
        }
      }
    }
    return value
  }
  nextType(): TokenType {
    this.skip()
    return this.token ? this.token[0] : ''
  }
  pop(): Token | null {
    this.skip()
    const token = this.token
    this.token = null
    return token ? token : null
  }
  expand(field: TokenField, func: () => void): void {
    const parent = this.field
    this.field = field
    func()
    if (this.token) {
      this.index -= this.token[1].length
      this.token = null
    }
    this.field = parent
  }
}
