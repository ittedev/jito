import { TokenField, TokenType, Token } from './types.ts'

export class Lexer
{
  constructor(
    private text: string,
    private field: TokenField,
    private index = 0,
    private token: Token | null = null
  ) {}

  private _next(start: number): Token | null
  {
    let token = ['', '']
    for (this.index = start; this.index < this.text.length; this.index++) {
      let nextType = distinguish(this.field, token[1] + this.text[this.index])
      if (nextType === 'other') {
        return token as Token
      } else {
        token[0] = nextType
        token[1] = token[1] + this.text[this.index]
      }
    }
    return token as Token
  }

  skip(skipArray: Array<string> = []): string
  {
    skipArray.unshift('other')
    let value = ''
    if (!this.token) {
      for (let i = this.index; i < this.text.length; i++) {
        if (skipArray.includes(distinguish(this.field, this.text[i]))) {
          value += this.text[i]
        } else {
          this.token = this._next(i) as Token
          if (this.token && this.token[0] === 'partial') {
            value += this.token[1]
            i = this.index - 1
            this.token = null
          } else {
            return value
          }
        }
      }
    }
    return value
  }

  nextIs(): TokenType
  nextIs(type: TokenType): boolean
  nextIs(type?: TokenType): TokenType | boolean
  {
    this.skip()
    if (this.token) {
      return type ? this.token[0] === type : this.token[0]
    } else {
      return false
    }
  }

  pop(): Token | null
  {
    this.skip()
    let token = this.token
    this.token = null
    return token ? token : null
  }

  expand(field: TokenField, func: () => void): void
  {
    let parent = this.field
    this.field = field
    func()
    if (this.token) {
      this.index -= this.token[1].length
      this.token = null
    }
    this.field = parent
  }

  must(type: TokenType): Token
  {
    let token = this.pop()
    if (!token || token[0] !== type) throw Error(type + ' is required.')
    return token
  }
}

function distinguish(field: TokenField, value: string): TokenType
{
  switch (field) {
    case 'html':
      switch (value) {
        case '>':
        case '<!--':
        case '/':
        case '{{':
        case '{|':
          return value
        case '&':
        case '&a': case '&am': case '&amp':
        case '&l': case '&lt':
        case '&g': case '&gt':
        case '&q': case '&qu': case '&quo': case '&quot':
        case '<': case '</': case '<!': case '<!-': case '{':
          return 'partial'
        case '&amp;': case '&lt;': case '&gt;': case '&quot;':
          return 'entity'
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return '//'
        case /^<[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(value): return 'start'
        case /^<\/[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(value): return 'end'
      }
      break
    case 'attr':
      switch (value) {
        case '@try': case '@catch':
        case '@if': case '@else':
        case '@for': case '@each':
          return '@'
        case '=': case ':=': case '&=': case '*=':
          return 'assign'
        case '>': case '/': case "'": case '"':
          return value
        case ':': case '&': case '*':
          return 'partial'
      }
      switch (true) {
        case /^on[_\$\-a-zA-Z0-9]+$/.test(value): return 'on'
        case /^[_\$\-@a-zA-Z0-9]+$/.test(value): return 'name'
      }
      break
    case 'comment':
      switch (value) {
        case '-->':
          return value
        case '-': case '--':
          return 'partial'
      }
      break
    case 'plane':
      switch (value) {
        case '<': case '</': case '</s': case '</sc': case '</scr': case '</scri': case '</scrip': case '</script':
          return 'partial'
        case '</script>':
          return 'end'
      }
      break
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
        case "|}":
          return value
      }
      switch (true) {
        case /^\/\/.*$/.test(value): return '//'
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value): return 'word'
        case /^\d+\.?\d*$|^\.?\d+$/.test(value): return 'number'
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
    case 'single':
    case 'double':
      switch (value) {
        case '\\': return 'partial'
        case '\r': case '\n': case '\r\n': return 'return'
        case '\\\r\n': return 'escape'
        case '\'':
          if (field === 'single') return value
          break
        case '\"':
          if (field === 'double') return value
          break
      }
      switch (true) {
        case /^\\u[0-9a-fA-F]{0,3}$/.test(value):
        case /^\\x[0-9a-fA-F]{0,1}$/.test(value):
        case /^\\u\{(0?[0-9a-fA-F]{0,5}|10[0-9a-fA-F]{0,4})$/.test(value):
          return 'partial'
        case /^\\.$/.test(value):
        case /^\\u[0-9a-fA-F]{4}$/.test(value):
        case /^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(value):
        case /^\\x[0-9a-fA-F]{2}$/.test(value):
          return 'escape'
      }
      break
    case 'text':
      switch (value) {
        case '{': case '}': case '|': return 'partial'
        case '{{': case '}}':
        case '{|': case '|}': return value
      }
      break
  }
  return 'other'
}

export function unescape(value: string): string
{
  switch (value) {
    case '\\n': return '\n'
    case '\\r': return '\r'
    case '\\v': return '\v'
    case '\\t': return '\t'
    case '\\b': return '\b'
    case '\\f': return '\f'
  }
  switch (true) {
    case /^\\u[0-9a-fA-F]{4}$/.test(value):
    case /^\\x[0-9a-fA-F]{2}$/.test(value):
      return String.fromCodePoint(parseInt(value.slice(2), 16))
    case /^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(value):
      return String.fromCodePoint(parseInt(value.slice(3,-1), 16))
  }
  return value.slice(1)
}
