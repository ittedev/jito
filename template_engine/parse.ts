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
  TreeTemplate
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression, innerText } from './script_parser.ts'

const parser = new DOMParser()

export function parse(html: string | HTMLTemplateElement): TreeTemplate {
  if (typeof html === 'string') {
    const doc = parser.parseFromString(html, 'text/html')
    return { type: 'tree', children: parseChildren(doc.head).concat(parseChildren(doc.body)) }
  } else {
    const node = html.content
    return { type: 'tree', children: parseChildren(node) }
  }
}

class DomLexer {
  constructor(
    public node: Node | null
  ) {}
  hasAttribute(attr: string): boolean {
    return !!(
      this.node &&
      this.node.nodeType === 1 &&
      (this.node as Element).hasAttribute(attr)
    )
  }
  pop(): Node | null {
    const node = this.node
    this.node = this.node ? this.node.nextSibling : null
    return node
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
  switch ((lexer.node as Node).nodeType) {
    case 3: // TEXT_NODE
      return parseText(lexer.pop() as Text)
    case 1: { // ELEMENT_NODE
      return parseEach(lexer)
    }
    default:
      return ''
  }
}

function parseText(node: Text): Template | string {
  return innerText(new Lexer(node.data, 'innerText'))
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
    const array = expression(new Lexer(el.getAttribute('@for') as string, 'script'))
    return { type: 'each', each, array, value: parseIf(lexer) } as EachTemplate
  } else {
    return parseIf(lexer)
  }
}

function parseIf(lexer: DomLexer): Template {
  const el = lexer.node as Element
  if (el.hasAttribute('@if')) {
    const condition = expression(new Lexer(el.getAttribute('@if') as string, 'script'))
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
    type: 'element',
    tag: el.tagName.toLowerCase(),
  } as ElementTemplate
  
  if (el.hasAttributes()) {
    const style = [] as Array<string | Template>
    el.getAttributeNames().forEach(name => {
      const value = el.getAttribute(name) as string
      switch (name) {
        case 'class':
        case 'part': {
          if (!(name in template)) {
            template[name] = [] as Array<Array<string> | Template>
          }
          return (template[name] as Array<Array<string> | Template>).push(value.split(/\s+/))
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
              if (!(match.groups.name in template)) {
                template[match.groups.name] = [] as Array<Array<string> | Template>
              }
              return (template[match.groups.name] as Array<Array<string> | Template>).push({ type: 'flags', value: expression(new Lexer(value, 'script')) } as FlagsTemplate)
            }
            case 'style': {
              return style.push(expression(new Lexer(value, 'script')))
            }
            // events
          }
        }
      }

      // assign attribute
      {
        const match = name.match(/^(?<name>.+):$/)
        if (match?.groups) {
          if (!('attr' in template)) {
            template.attr = {} as Record<string, unknown | Template>
          }
          return (template.attr as Record<string, unknown | Template>)[match.groups.name] = expression(new Lexer(value, 'script'))
        }
      }

      // bind attribute
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
      if (!('attr' in template)) {
        template.attr = {} as Record<string, unknown | Template>
      }
      if (!(name in (template.attr as Record<string, unknown | Template>))) {
        return (template.attr as Record<string, unknown | Template>)[name] = value
      }
      return
    })
    if (style.length) {
      if (style.length === 1 && typeof style[0] === 'string') {
        template.style = style[0]
      } else {
        template.style = { type: 'join', values: style.filter(value => value !== ''), separator: ';' } as JoinTemplate
      }
    }
  }
  if (el.hasChildNodes()) {
    template.children = parseChildren(el)
  }
  
  return template
}
