// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  instanceOfTemplate,
  Template,
  JoinTemplate,
  GroupTemplate,
  FlagsTemplate,
  IfTemplate,
  ForTemplate,
  ElementTemplate,
  TreeTemplate,
  GetTemplate,
  HandlerTemplate,
  TemporaryNode,
  TemporaryText,
  TemporaryElement,
  instanceOfTemporaryElement
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression } from './expression.ts'
import { dom } from './dom.ts'

export function parse(html: string): TreeTemplate {
  const node = dom(html)
  const children = node ? parseTree(node) : []
  return children.length ? { type: 'tree', children } : { type: 'tree' }
}

function parseText(lexer: Lexer): Template | string {
  const texts = [] as Array<string | Template>
  texts.push(lexer.skip())
  while (lexer.nextIs()) {
    if (lexer.nextIs('{{')) {
      lexer.pop()
      lexer.expand('script', () => {
        texts.push(expression(lexer))
      })
      lexer.must('}}')
      texts.push(lexer.skip())
    } else {
      lexer.pop()
    }
  }
  // TODO:

  // optimize
  const values = texts.filter(value => value !== '')
  if (values.length === 1 && typeof values[0] === 'string') {
    return values[0]
  } else {
    return { type: 'join', values, separator: '' } as JoinTemplate
  }
}

class DomLexer {
  constructor(
    public node?: TemporaryNode
  ) {}
  isSkippable(prop: string): boolean {
    for (let node = this.node; node; node = (node as TemporaryNode).next) {
      console.log('node:', node)
      if (instanceOfTemporaryElement(node)) {
        return hasAttr(node, prop)
      } else {
        if (!/^\s*$/.test((node as TemporaryText).text)) {
          return false
        }
      }
    }
    return false
  }
  // Warning: This method should only be called when skippable
  skip(): this {
    while (true) {
      if (instanceOfTemporaryElement(this.node as TemporaryNode)) {
        return this
      }
      this.node = (this.node as TemporaryNode).next
    }
  }
  pop(): TemporaryNode | undefined {
    const node = this.node
    this.node = this.node?.next
    return node
  }
}

function parseTree(node: TemporaryNode): Array<Template | string> {
  const lexer = new DomLexer(node)
  const children = [] as Array<Template | string>
  while (lexer.node) {
    const result = parseNode(lexer)
    if (result !== undefined) {
      children.push(result)
    }
  }
  return children
}

function parseNode(lexer: DomLexer): Template | string | void {
  if (!lexer.node) {
    lexer.pop()
  } else if (instanceOfTemporaryElement(lexer.node)) {
    return parseFor(lexer)
  } else {
    return parseText(new Lexer((lexer.pop() as TemporaryText).text, 'text'))
  }
}

function parseChild(lexer: DomLexer): Template {
  return parseFor(lexer)
}

function parseFor(lexer: DomLexer): Template {
  const el = lexer.node as TemporaryElement
  if (hasAttr(el, '@for')) {
    const each = getAttr(el, '@each') || undefined
    const array = expression(getAttr(el, '@for'))
    return { type: 'for', each, array, value: parseIf(lexer) } as ForTemplate
  } else {
    return parseIf(lexer)
  }
}

function parseIf(lexer: DomLexer): Template {
  const el = lexer.node as TemporaryElement
  if (hasAttr(el, '@if')) {
    const condition = expression(getAttr(el, '@if'))
    const truthy = parseGroup(el)
    lexer.pop()
    const template = { type: 'if', condition, truthy } as IfTemplate
    if (lexer.isSkippable('@else')) {
      template.falsy = parseChild(lexer.skip())
    }
    return template
  } else {
    return parseGroup(lexer.pop() as TemporaryElement)
  }
}

function parseGroup(el: TemporaryElement): Template {
  if (el.tag === 'group') {
    const template = {
      type: 'group',
    } as GroupTemplate
    el.attrs?.forEach(([name,, value]) => {
      // syntax attribute
      if (name.match(/^@(if|else|for|each)$/)) return
      if (name.match(/^@.*$/)) {
        if (!template.props) {
          template.props = {} as Record<string, unknown | Template>
        }
        (template.props as Record<string, unknown | Template>)[name] = value
      }
    })
    if (el.child) {
      const children = parseTree(el.child)
      if (children.length) {
        template.children = children
      }
    }
    return template
  } else {
    return parseElement(el)
  }
}

function parseElement(el: TemporaryElement): ElementTemplate {
  console.log('el:', el)
  const template = {
    type: 'element',
    tag: el.tag,
  } as ElementTemplate

  {
    const style = [] as Array<string | Template>
    el.attrs?.forEach(([name, assign, value]) => {
      switch (assign) {
        case '=': { // string attribute
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
          }
          if (!(name in (template.props ?? (template.props = {}) as Record<string, unknown | Template>))) {
            return (template.props as Record<string, unknown | Template>)[name] = value
          }
          return
        }

        case ':=': {// assign attribute
          switch (name) {
            case 'is':
              return template.is = expression(value)
            case 'class':
            case 'part': {
              const n = name.slice(0, -1) as 'class' | 'part'
              return (template[n] ?? (template[n] = []) as Array<Array<string> | Template>).push({ type: 'flags', value: expression(value) } as FlagsTemplate)
            }
            case 'style': {
              return style.push(expression(value))
            }
          }
          return (template.props ?? (template.props = {}))[name] = expression(value)
        }

        case '*=': { // ref attribute
          let ref = expression(value)
          if (instanceOfTemplate(ref) && ref.type === 'get') {
            ref = (ref as GetTemplate).value
          }
          return (template.props ?? (template.props = {}))[name] = ref
        }

        case 'on': { // on attribute
          const type = name.slice(2)
          const handler = { type: 'handler', value: expression(value) } as HandlerTemplate
          return ((template.on ?? (template.on = {}))[type] ?? (template.on[type] = [])).push(handler)
        }
      }
    })

    if (style.length) {
      if (style.length === 1 && typeof style[0] === 'string') {
        template.style = style[0]
      } else {
        template.style = { type: 'join', values: style.filter(value => value !== ''), separator: ';' } as JoinTemplate
      }
    }

     // boolean attribute
    el.attrs?.forEach(([name, assign, value]) => {
      if (assign === '&=') {
        (template.bools ?? (template.bools = {}) as Record<string, unknown | Template>)[name] = expression(value)
        if (template.props) {
          delete template.props[name]
          if (!Object.keys(template.props).length) {
            delete template.props
          }
        }
      }
    })
  }

  if (el.child) {
    const children = parseTree(el.child)
    if (children.length) {
      template.children = children
    }
  }

  return template
}

function hasAttr(el: TemporaryElement, prop: string): boolean {
  return el.attrs?.some(attr => attr[0] === prop)
}

function getAttr(el: TemporaryElement, prop: string): string {
  const attr = el.attrs?.find(attr => attr[0] === prop)
  return attr ? attr[2] : ''
}
