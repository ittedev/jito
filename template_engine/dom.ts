import {
  TemporaryNode,
  TemporaryText,
  TemporaryElement,
  Token,
  TokenField,
  TokenType,
  instanceOfTemporaryElement
} from './types.ts'
import { Lexer, unescape } from './lexer.ts'
import { notHasEnd } from './is_primitive.ts'

export function dom(html: string): TemporaryNode | undefined
export function dom(lexer: Lexer): TemporaryNode | undefined
export function dom(html: Lexer | string): TemporaryNode | undefined
{
  let lexer = typeof html === 'string' ? new Lexer(html, 'html') : html
  let text = { text: skip(lexer) } as TemporaryText

  // remove comment
  while (lexer.nextIs('<!--')) {
    lexer.pop()
    lexer.expand('comment', () => lexer.must('-->'))
    text.text += skip(lexer)
    continue
  }

  if (lexer.nextIs('start')) {
    let next = el(lexer)
    if (next) {
      if (instanceOfTemporaryElement(next)) {
        text.next = next
      } else {
        text.text = (next as TemporaryText).text
        if (next.next) {
          text.next = next.next
        }
      }
    }
  }
  return text.text ? text : text.next ? text.next : undefined
}

function skip(lexer: Lexer): string
{
  let text = lexer.skip(['>', '/', '}}'])
  if (lexer.nextIs('entity')) {
    let token = lexer.pop() as Token
    switch (token[1]) {
      case '&amp;': return text + '&' + skip(lexer)
      case '&lt;': return text + '<' + skip(lexer)
      case '&gt;': return text + '>' + skip(lexer)
      case '&quot;': return text + '"' + skip(lexer)
    }
  }
  if (lexer.nextIs('{{')) {
    text += (lexer.pop() as Token)[1]
    lexer.expand('text', () => {
      text += lexer.skip(['{{'])
      text += lexer.must('}}')[1]
    })
    return text + skip(lexer)
  }
  return text
}

function el(lexer: Lexer): TemporaryNode | undefined
{
  let el = {
    tag: (lexer.pop() as Token)[1].slice(1).toLocaleLowerCase() // start = <.*
  } as TemporaryElement

  // get attributes
  let attrs = attr(lexer)
  if (attrs.length) {
    el.attrs = attrs
  }

  if (lexer.nextIs('/')) {
    lexer.pop()
    lexer.must('>')
  } else if (notHasEnd(el.tag)) {
    lexer.must('>')
  } else {
    lexer.must('>')
    let child = dom(lexer)
    if (child) {
      el.child = child
    }
    // Not supported: p, dt, dd, li, option, thead, tfoot, th, tr, td, rt, rp, optgroup, caption
    if (lexer.must('end')[1].slice(2) !== el.tag) {
      throw Error(`end tag <${el.tag}> is required.`)
    }
    lexer.must('>')
  }
  let next = dom(lexer)
  if (next) {
    el.next = next
  }
  if (el.tag === 'script') { // skip <script>
    return el.next ? el.next : el
  } else {
    return el
  }
}

function attr(lexer: Lexer): Array<[string, string, string]>
{
  let attrs = [] as Array<[string, string, string]>
  lexer.expand('attr', () => {
    lexer.skip()
    while (lexer.nextIs()) {
      if (lexer.nextIs('>')) {
        break
      } else {
        let attr = new Array(3) as [string, string, string]
        if (lexer.nextIs('name')) {
          attr[0] = (lexer.pop() as Token)[1]
          if (lexer.nextIs('assign')) {
            attr[1] = (lexer.must('assign') as Token)[1]
          } else if (lexer.nextIs('name') || lexer.nextIs('>') || lexer.nextIs('/')) {
            attr[1] = '='
            attr[2] = attr[0]
          } else {
            throw Error('assign is required.')
          }
        } else {
          if (lexer.nextIs('on')) {
            attr[0] = (lexer.pop() as Token)[1]
            attr[1] = 'on'
          } else if (lexer.nextIs('@')) {
            attr[0] = (lexer.pop() as Token)[1]
            attr[1] = '@'
          } else {
            break
          }
          if (attr[0] === '@try' || attr[0] === '@catch' || attr[0] === '@else') {
            attr[2] = attr[0]
          } else {
            let token = (lexer.must('assign') as Token)
            if (token[1] !== '=') {
              throw Error('= is required.')
            }
          }
        }
        if (attr[2] === undefined) {
          if (lexer.nextIs('"')) {
            attr[2] = string(lexer, 'double', (lexer.pop() as Token)[0])
          } else if (lexer.nextIs("'")) {
            attr[2] = string(lexer, 'single', (lexer.pop() as Token)[0])
          }
        }
        attrs.push(attr)
        lexer.skip()
      }
    }
  })
  return attrs
}

function string(lexer: Lexer, field: TokenField, type: TokenType): string
{
  let text = '' as string
  lexer.expand(field, () => {
    loop: while (true) {
      text += lexer.skip()
      let token = lexer.pop() as Token
      switch (token[0]) {
        case type: break loop
        case 'return': throw Error('Newline cannot be used')
        case 'escape':
          text += unescape(token[1])
          continue
      }
    }
  })
  return text
}
