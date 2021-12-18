// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Template,
  JoinTemplate,
  FlagsTemplate,
  IfTemplate,
  EachTemplate,
  ElementTemplate,
  TokenField,
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression, innerText } from './parser.ts'

const parser = new DOMParser()

export function parse(html: string | HTMLTemplateElement): Array<Template | string> {
  const node = typeof html === 'string' ? parser.parseFromString(html, 'text/html') : html.content
  if (node.hasChildNodes()) {
    return parseChildren(node)
  } else {
    return []
  }
}

class DomLexer {
  constructor(
    public node: Node | null
  ) {}
  next(): Node | null {
    return this.node ? this.node.nextSibling : null
  }
  hasAttribute(attr: string): boolean {
    return !!(
      this.node &&
      this.node.nodeType === 1 &&
      (this.node as Element).hasAttribute(attr)
    )
  }
  pop(): Node | null {
    return this.node = this.node ? this.node.nextSibling : null
  }
}

function parseChildren(node: Node): Array<Template | string> {
  const lexer = new DomLexer(node.firstChild)
  const children = [] as Array<Template | string>
  while (lexer.node) {
    children.push(parseNode(lexer))
  }
  return children
}

function parseNode(lexer: DomLexer): Template | string {
  switch ((lexer.next() as Node).nodeType) {
    case 3: // TEXT_NODE
      return parseText(lexer.pop() as Text)
    case 1: { // ELEMENT_NODE
      return parseEach(lexer)
    }
    default:
      return ''
  }
}

function parseText(node: Text): Template {
  return innerText(new Lexer(node.data, TokenField.innerText))
}

function parseChild(lexer: DomLexer): Template {
  return parseEach(lexer)
}

// function parseTry(lexer: DomLexer): Template {
//   if ((lexer.node as Element).hasAttribute('@try')) {
//     const statement = parseEach(lexer)
//     if (lexer.hasAttribute('@catch')) {
//       const catchStatement = parseChild(lexer)
//       const exceptionVar = (lexer.node as Element).getAttribute('@catch')
//       return new TryTemplate(statement, catchStatement, exceptionVar)
//     } else {
//       return new TryTemplate(statement)
//     }
//   } else {
//     return parseEach(lexer)
//   }
// }

function parseEach(lexer: DomLexer): Template {
  const el = lexer.node as Element
  if (el.hasAttribute('@for')) {
    const each = el.getAttribute('@each')
    const array = expression(new Lexer(el.getAttribute('@for') as string, TokenField.script))
    return { type: 'each', each, array, value: parseIf(lexer) } as EachTemplate
  } else {
    return parseIf(lexer)
  }
}

function parseIf(lexer: DomLexer): Template {
  const el = lexer.node as Element
  if (el.hasAttribute('@if')) {
    const condition = expression(new Lexer(el.getAttribute('@if') as string, TokenField.script))
    const truthy = parseRegion(el)
    lexer.pop()
    const falsy = lexer.hasAttribute('@else') ? parseChild(lexer) : undefined
    return { type: 'if', condition, truthy, falsy } as IfTemplate
  } else {
    return parseRegion(lexer.pop() as Element)
  }
}

function parseRegion(el: Element): Template {
  return parseElement(el)
}

function parseElement(el: Element): ElementTemplate {
  const template = {
    tag: el.tagName.toLowerCase(),
    class: [] as Array<Array<string> | Template>,
    part: [] as Array<Array<string> | Template>,
    attr: {} as Record<string, unknown | Template>,
    style: '' as string | Template,
    bind: {},
    children: [] as Array<Template | string>
  }
  
  if (el.hasAttributes()) {
    const style = [] as Array<string | Template>
    el.getAttributeNames().forEach(name => {
      const value = el.getAttribute(name) as string
      switch (name) {
        case 'class':
        case 'part': {
          return template[name].push(value.split(/\s+/))
        }
        case 'style': {
          return style.push(value)
        }
      }

      // addition assign attribute
      {
        const match = name.match(/^(?<name>.+)(\+.*)$/)
        if (match?.groups) {
          switch (match.groups.name) {
            case 'class':
            case 'part': {
              return template[match.groups.name].push({ type: 'flags', value: expression(new Lexer(value, TokenField.script)) } as FlagsTemplate)
            }
            case 'style': {
              return style.push(expression(new Lexer(value, TokenField.script)))
            }
            // events
          }
        }
      }

      // assign attribute
      {
        const match = name.match(/^(?<name>.+):$/)
        if (match?.groups) {
          return template.attr[match.groups.name] = expression(new Lexer(value, TokenField.script))
        }
      }

      // bind
      {
        const match = name.match(/^(?<name>.+)\*$/)
        if (match?.groups) {
          // TODO
          // bindFormula(value, bind, match.groups.name)
        }
      }

      // syntax attribute
      if (name.match(/^@.+$/)) return

      // string attribute
      if (!(name in template.attr)) {
        return template.attr[name] = value
      }
      return
    })
    if (style.length) {
      
      template.style = { type: 'join', values: style.filter(value => value !== ''), separator: ';' } as JoinTemplate
    }
  }
  if (el.hasChildNodes()) {
    template.children = parseChildren(el)
  }
  
  return { type: 'element', el: template } as ElementTemplate
}
