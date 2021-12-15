// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { TokenField, TokenType, Token } from '../types.ts'

function distinguish(field: TokenField, value: string): TokenType {
  switch (field) {
    case TokenField.script:
      switch (value) {
        case '+': case '-':
          return TokenType.multiOpetator

        case 'void': case 'typeof': case '~': case '!':
          return TokenType.unaryOpetator

        case '/': case '*': case '%': case '**': // Arithmetic operators
        case 'in': case 'instanceof': case '<': case '>': case '<=': case '>=': // Relational operators
        case '==': case '!=': case '===': case '!==': // Equality operators
        case '<<': case '>>': case '>>>': // Bitwise shift operators
        case '&': case '|': case '^': // Binary bitwise operators
        case '&&': case '||': case '??': // Binary logical operators
          return TokenType.binaryOpetator

        case '=': case '*=': case '**=': case '/=': case '%=': case '+=': case '-=':
        case '<<=': case '>>=': case '>>>=': case '&=': case '^=': case '|=':
        case '&&=': case '||=': case '??=':
          return TokenType.assignOpetator

        case 'false': case 'true':
          return TokenType.boolean

        case 'null': return TokenType.null
        case 'undefined': return TokenType.undefined
        case '++': return TokenType.crement
        case '--': return TokenType.crement
        case '.': return TokenType.chaining
        case '?.': return TokenType.optional
        case '[': return TokenType.leftSquare
        case ']': return TokenType.rightSquare
        case '{': return TokenType.leftBrace
        case '}': return TokenType.rightBrace
        case '(': return TokenType.leftRound
        case ')': return TokenType.rightRound
        case '...': return TokenType.spread
        case '?': return TokenType.question
        case ':': return TokenType.colon
        case ',': return TokenType.comma
        case '\'': return TokenType.singleQuote
        case '\"': return TokenType.doubleQuote
        case '`': return TokenType.backQuote
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return TokenType.comment
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value): return TokenType.word
        case /^\d+\.?\d*$|^\.?\d+$/.test(value): return TokenType.number
      }
      break
    // deno-lint-ignore no-fallthrough
    case TokenField.template:
      switch (value) {
        case '$': return TokenType.partial
        case '${': return TokenType.leftPlaceHolder
        case '}': return TokenType.rightPlaceHolder
        case '`': return TokenType.backQuote
        case '\r': case '\n': case '\r\n':
          return TokenType.other
      }
    case TokenField.singleString:
    case TokenField.doubleString:
      switch (value) {
        case '\\': return TokenType.partial
        case '\r': case '\n': case '\r\n': return TokenType.return
        case '\\\r\n': return TokenType.escape
        case '\'':
          if (field === TokenField.singleString) return TokenType.singleQuote
          break
        case '\"':
          if (field === TokenField.doubleString) return TokenType.doubleQuote
          break
      }
      switch (true) {
        case /^\\(x|u)$/.test(value): return TokenType.partial
        case /^\\.$/.test(value): return TokenType.escape
      }
      break
    case TokenField.innerText:
      switch (value) {
        case '{': case '}': return TokenType.partial
        case '{{': return TokenType.leftMustache
        case '}}': return TokenType.rightMustache
      }
      break
  }
  return TokenType.other
}

export class Lexer {
  index = 0
  token: Token | null = null
  constructor(
    private text: string,
    private field: TokenField
  ) {}
  private _next(start: number): Token | null {
    const token = { type: TokenType.none, value: '' }
    for (this.index = start; this.index < this.text.length; this.index++) {
      const nextType = distinguish(this.field, token.value + this.text[this.index])
      if (nextType === TokenType.other) {
        return token
      } else {
        token.type = nextType
        token.value = token.value + this.text[this.index]
      }
    }
    return token
  }
  skip(): string {
    let value = ''
    if (!this.token) {
      for (let i = this.index; i < this.text.length; i++) {
        if (distinguish(this.field, this.text[i]) === TokenType.other) {
          value += this.text[i]
        } else {
          this.token = this._next(i)
          if (this.token?.type === TokenType.partial) {
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
    return this.token ? this.token.type : TokenType.none
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
