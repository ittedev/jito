// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Template,
  JoinTemplate,
  GroupTemplate,
  FlagsTemplate,
  IfTemplate,
  ForTemplate,
  ElementTemplate,
  TreeTemplate,
  ExpandTemplate
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression, innerText } from './script_parser.ts'

const parser = new DOMParser()

export function parse(html: string | HTMLTemplateElement, field: 'tree' | 'text' | 'script' = 'tree'): string | Template {
  switch (field) {
    case 'tree':
      if (typeof html === 'string') {
        const doc = parser.parseFromString(html, 'text/html')
        return { type: 'tree', children: parseChildren(doc.head).concat(parseChildren(doc.body)) } as TreeTemplate
      } else {
        const node = html.content
        return { type: 'tree', children: parseChildren(node) } as TreeTemplate
      }
    case 'text':
      return innerText(new Lexer(html as string, field))
    case 'script':
      return expression(new Lexer(html as string, field))
  }
}

class DomLexer {
  constructor(
    public node: Node | null
  ) {}
  hasAttribute(props: string): boolean {
    return !!(
      this.node &&
      this.node.nodeType === 1 &&
      (this.node as Element).hasAttribute(props)
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
      return parse((lexer.pop() as Text).data, 'text')
    case 1: { // ELEMENT_NODE
      return parseFor(lexer)
    }
    // TODO: parse svg
    default:
      return ''
  }
}

function parseChild(lexer: DomLexer): Template {
  return parseFor(lexer)
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

// TODO: parse boundary numbers algorithm

function parseFor(lexer: DomLexer): Template {
  const el = lexer.node as Element
  if (el.hasAttribute('@for')) {
    const each = el.getAttribute('@each') || undefined
    const array = parse(el.getAttribute('@for') as string, 'script')
    return { type: 'for', each, array, value: parseIf(lexer) } as ForTemplate
  } else {
    return parseIf(lexer)
  }
}

function parseIf(lexer: DomLexer): Template {
  const el = lexer.node as Element
  if (el.hasAttribute('@if')) {
    const condition = parse(el.getAttribute('@if') as string, 'script')
    const truthy = parseExpand(el)
    lexer.pop()
    const falsy = lexer.hasAttribute('@else') ? parseChild(lexer) : undefined
    return { type: 'if', condition, truthy, falsy } as IfTemplate
  } else {
    return parseExpand(lexer.pop() as Element)
  }
}

function parseExpand(el: Element): Template {
  if (el.hasAttribute('@expand')) {
    const template = parse(el.getAttribute('@expand') as string, 'script')
    const def = parseGroup(el)
    return { type: 'expand', template, default: def } as ExpandTemplate
  } else {
    return parseGroup(el)
  }
}
// TODO: parse Group
function parseGroup(el: Element): Template {
  if (el.tagName.toLowerCase() === 'group') {
    const template = {
      type: 'group',
    } as GroupTemplate
    if (el.hasAttributes()) {
      el.getAttributeNames().forEach(name => {
        // syntax attribute
        if (name.match(/^@(if|else|for|each|expand)$/)) return
        if (name.match(/^@.*$/)) {
          if (!template.props) {
            template.props = {} as Record<string, unknown | Template>
          }
          (template.props as Record<string, unknown | Template>)[name] = el.getAttribute(name)
        }
      })
    }
    
    if (el.hasChildNodes()) {
      template.children = parseChildren(el)
    }
    return template
  } else {
    return parseElement(el)
  }
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
        case 'is': {
          if (!(name in template)) {
            template.is = value
          }
          return
        }
        case 'class':
        case 'part': {
          if (!(name in template)) {
            template[name] = [] as Array<Array<string> | FlagsTemplate>
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
          const name = match.groups.name
          const exp = parse(value, 'script') as Template
          switch (name) {
            case 'is': {
              return template.is = exp
            }
            case 'class':
            case 'part': {
              if (!(name in template)) {
                template[name] = [] as Array<Array<string> | FlagsTemplate>
              }
              return (template[name] as Array<Array<string> | Template>).push({ type: 'flags', value: exp } as FlagsTemplate)
            }
            case 'style': {
              return style.push(exp)
            }
          }
        }
      }

      // assign attribute
      {
        const match = name.match(/^(?<name>.+):$/)
        if (match?.groups) {
          if (!template.props) {
            template.props = {} as Record<string, unknown | Template>
          }
          return (template.props as Record<string, unknown | Template>)[match.groups.name] = parse(value, 'script')
        }
      }

      // TODO: bind attribute
      // bind attribute
      {
        const match = name.match(/^(?<name>.+)\*$/)
        if (match?.groups) {
          // bindFormula(value, bind, match.groups.name)
        }
      }

      // syntax attribute
      if (name.match(/^@(if|else|for|each|expand)$/)) return

      // string attribute
      if (!template.props) {
        template.props = {} as Record<string, unknown | Template>
      }
      if (!(name in (template.props as Record<string, unknown | Template>))) {
        return (template.props as Record<string, unknown | Template>)[name] = value
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
