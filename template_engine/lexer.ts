// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { TokenField, TokenType, Token } from './types.ts'

function distinguish(field: TokenField, value: string): TokenType {
  switch (field) {
    case 'script':
      switch (value) {
        case '+': case '-':
          return 'multiOpetator'

        case 'void': case 'typeof': case '~': case '!':
          return 'unaryOpetator'

        case '/': case '*': case '%': case '**': // Arithmetic operators
        case 'in': case 'instanceof': case '<': case '>': case '<=': case '>=': // Relational operators
        case '==': case '!=': case '===': case '!==': // Equality operators
        case '<<': case '>>': case '>>>': // Bitwise shift operators
        case '&': case '|': case '^': // Binary bitwise operators
        case '&&': case '||': case '??': // Binary logical operators
          return 'binaryOpetator'

        case '=': case '*=': case '**=': case '/=': case '%=': case '+=': case '-=':
        case '<<=': case '>>=': case '>>>=': case '&=': case '^=': case '|=':
        case '&&=': case '||=': case '??=':
          return 'assignOpetator'

        case '++': case '--':
          return 'crementOpetator'

        case 'false': case 'true':
          return 'boolean'

        case 'null': return 'null'
        case 'undefined': return 'undefined'
        case '.': return 'chaining'
        case '?.': return 'optional'
        case '[': return 'leftSquare'
        case ']': return 'rightSquare'
        case '{': return 'leftBrace'
        case '}': return 'rightBrace'
        case '(': return 'leftRound'
        case ')': return 'rightRound'
        case '...': return 'spread'
        case '?': return 'question'
        case ':': return 'colon'
        case ',': return 'comma'
        case '\'': return 'singleQuote'
        case '\"': return 'doubleQuote'
        case '`': return 'backQuote'
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return 'lineComment'
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value): return 'word'
        case /^\d+\.?\d*$|^\.?\d+$/.test(value): return 'number'
      }
      break
    // deno-lint-ignore no-fallthrough
    case 'template':
      switch (value) {
        case '$': return 'partial'
        case '${': return 'leftPlaceHolder'
        case '}': return 'rightPlaceHolder'
        case '`': return 'backQuote'
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
          if (field === 'singleString') return 'singleQuote'
          break
        case '\"':
          if (field === 'doubleString') return 'doubleQuote'
          break
      }
      switch (true) {
        case /^\\(x|u)$/.test(value): return 'partial'
        case /^\\.$/.test(value): return 'escape'
      }
      break
    case 'innerText':
      switch (value) {
        case '{': case '}': return 'partial'
        case '{{': return 'leftMustache'
        case '}}': return 'rightMustache'
      }
      break
  }
  return 'other'
}

export class Lexer {
  index = 0
  token: Token | null = null
  constructor(
    private text: string,
    private field: TokenField
  ) {}
  private _next(start: number): Token | null {
    const token = { type: '', value: '' }
    for (this.index = start; this.index < this.text.length; this.index++) {
      const nextType = distinguish(this.field, token.value + this.text[this.index])
      if (nextType === 'other') {
        return token as Token
      } else {
        token.type = nextType
        token.value = token.value + this.text[this.index]
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
          if (this.token?.type === 'partial') {
            value += this.token.value
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
    return this.token ? this.token.type : ''
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
      this.index -= this.token.value.length
      this.token = null
    }
    this.field = parent
  }
}
