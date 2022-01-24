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
  ExpandTemplate,
  HandlerTemplate
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression, innerText } from './script_parser.ts'

const parser = new DOMParser()

export function parse(html: string | Element | DocumentFragment, field: 'tree' | 'text' | 'script' = 'tree'): string | Template {
  switch (field) {
    case 'tree':
      if (typeof html === 'string') {
        const doc = parser.parseFromString(html, 'text/html')
        return { type: 'tree', children: parseChildren(doc.head).concat(parseChildren(doc.body)) } as TreeTemplate
      } else if (html.nodeType === 11) { // DOCUMENT_FRAGMENT_NODE
        return { type: 'tree', children: parseChildren(html) } as TreeTemplate
      } else {// ELEMENT_NODE
        return parseElement(html as Element) as ElementTemplate
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
  isSkippable(props: string): boolean {
    for (let node = this.node; node; node = (node as Node).nextSibling) {
      switch (node.nodeType) {
        default:
          return false
        case 1: // ELEMENT_NODE
          return (node as Element).hasAttribute(props)
        case 3: // TEXT_NODE
          if (!/^\s*$/.test((node as Text).data)) {
            return false
          }
      }
    }
    return false
  }
  // Warning: This method should only be called when skippable
  skip(): this {
    while (true) {
      if ((this.node as Element).nodeType === 1) {
        return this
      }
      this.node = (this.node as Node).nextSibling
    }
  }
  pop(): Node | null {
    const node = this.node
    do {
      this.node = this.node ? this.node.nextSibling : null
    } while (this.node && this.node.nodeType === 1 && (this.node as Element).tagName === 'SCRIPT') // skip <script>
    return node
  }
}

function parseChildren(node: Node): Array<Template | string> {
  let firstChild = node.firstChild
  while (firstChild && firstChild.nodeType === 1 && (firstChild as Element).tagName === 'SCRIPT') { // skip <script>
    firstChild = firstChild.nextSibling
  }
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
    const falsy = lexer.isSkippable('@else') ? parseChild(lexer.skip()) : undefined
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

  {
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
          return (template[name] ?? (template[name] = [])).push(value.split(/\s+/))
        }
        case 'style': {
          return style.push(value)
        }
        case 'is:':
          return template.is = parse(value, 'script')
        case 'class:':
        case 'part:': {
          const n = name.slice(0, -1) as 'class' | 'part'
          return (template[n] ?? (template[n] = []) as Array<Array<string> | Template>).push({ type: 'flags', value: parse(value, 'script') } as FlagsTemplate)
        }
        case 'style:': {
          return style.push(parse(value, 'script'))
        }
      }

      // on attribute
      {
        const match = name.match(/^on(?<type>.+?):?$/)
        if (match?.groups) {
          const type = match.groups.type
          const handler = { type: 'handler', value: parse(value, 'script') } as HandlerTemplate
          return ((template.on ?? (template.on = {}))[type] ?? (template.on[type] = [])).push(handler)
        }
      }

      // assign attribute
      {
        const match = name.match(/^(?<name>.+):$/)
        if (match?.groups) {
          return (template.props ?? (template.props = {}))[match.groups.name] = parse(value, 'script')
        }
      }

      // TODO: bind attribute
      // bind attribute
      {
        const match = name.match(/^(?<name>.+)\*$/)
        if (match?.groups) {
          // bindFormula(value, bind, match.groups.name)
          return
        }
      }

      // syntax attribute
      if (name.match(/^@(if|else|for|each|expand)$/)) return

      // string attribute
      if (!(name in (template.props ?? (template.props = {}) as Record<string, unknown | Template>))) {
        return (template.props as Record<string, unknown | Template>)[name] = value
      }
    })

    if (style.length) {
      if (style.length === 1 && typeof style[0] === 'string') {
        template.style = style[0]
      } else {
        template.style = { type: 'join', values: style.filter(value => value !== ''), separator: ';' } as JoinTemplate
      }
    }

    if (template.props) {
      // boolean attribute
      for (const key in template.props) {
        const match = key.match(/^(?<name>.+)&$/)
        if (match?.groups) {
          const name = match.groups.name as string
          (template.bools ?? (template.bools = {}) as Record<string, unknown | Template>)[name] = parse(template.props[key] as string, 'script')
          delete template.props[name]
          delete template.props[key]
          delete template.props[name + ':']
        }
      }
      if (!Object.keys(template.props).length) {
        delete template.props
      }
    }
  }

  if (el.hasChildNodes()) {
    template.children = parseChildren(el)
  }

  return template
}
