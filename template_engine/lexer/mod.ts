import { TokenField, TokenType, Token } from './types.ts'

function distinguish(field: TokenField, value: string): TokenType {
  switch (field) {
    case TokenField.script:
      switch (value) {
        case 'false': case 'true': return TokenType.boolean
        case 'null': return TokenType.null
        case 'undefined': return TokenType.undefined
        case '+': case '-': case '*': case '**': case '/': case '%': case '==': case '===':case '!=':case '!==':
        case '<': case '>': case '<=': case '>=': case '||': case '&&': case '??':
        case '|': case '^': case '&': case '<<': case '>>': case '>>>': return TokenType.operator
        case '=': case '*=': case '**=': case '/=': case '%=': case '+=': case '-=':
        case '<<=': case '>>=': case '>>>=': case '&=': case '^=': case '|=':
        case '&&=': case '||=': case '??=': return TokenType.assign
        case '++': return TokenType.crement
        case '--': return TokenType.crement
        case '.': return TokenType.chaining
        case '?.': return TokenType.optional
        case '[': return TokenType.leftSquare
        case ']': return TokenType.rightSquare
        case '(': return TokenType.leftRound
        case ')': return TokenType.rightRound
        case '!': return TokenType.exclamation
        case '...': return TokenType.spread
        case '?': return TokenType.question
        case ':': return TokenType.colon
        case ',': return TokenType.comma
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return TokenType.comment
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value): return TokenType.word
        case /^'([^']|\\')*$|^"([^"]|\\")*$/.test(value): return TokenType.partial
        case /^'([^']|\\')*'$|^"([^"]|\\")*"$/.test(value): return TokenType.string
        case /^\d+\.?\d*$|^\.?\d+$/.test(value): return TokenType.number
      }
      break
    case TokenField.string:
    case TokenField.template:
      switch (value) {
        case '$': return TokenType.partial
        case '}': return TokenType.rightPlaceHolder
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
  text: string
  index = 0
  field: TokenField
  token: Token | null
  constructor(text: string, field: TokenField) {
    this.text = text
    this.field = field
    this.token = null
  }
  skip(): string {
    let value = ''
    if (!this.token) {
      for (let i = this.index; i < this.text.length; i++) {
        const nextType = distinguish(this.field, this.text[i])
        if (nextType === TokenType.other) {
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
  get next(): Token | null {
    if (this.token) {
      return this.token
    } else {
      this.token = this._next(this.index)
      return this.token
    }
  }
  pop(): Token | null {
    const token = this.token ? this.token : this._next(this.index)
    this.token = null
    return token
  }
}
