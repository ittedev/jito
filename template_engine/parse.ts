import {
  instanceOfTemplate,
  Template,
  JoinTemplate,
  GroupTemplate,
  FlagsTemplate,
  TryTemplate,
  IfTemplate,
  ForTemplate,
  BindTemplate,
  ElementTemplate,
  CustomElementTemplate,
  TreeTemplate,
  GetTemplate,
  SplitTemplate,
  HandlerTemplate,
  TemporaryNode,
  TemporaryText,
  TemporaryElement,
  FlatTemplate,
  instanceOfTemporaryElement,
  Token
} from './types.ts'
import { Lexer } from './lexer.ts'
import { expression } from './expression.ts'
import { dom } from './dom.ts'
import { isPrimitive } from './is_primitive.ts'

export function parse(html: string): TreeTemplate
{
  let node = dom(html)
  let children = node ? parseTree(node) : []
  return children.length ? { type: 'tree', children } : { type: 'tree' }
}

class DomLexer
{
  constructor(
    public node?: TemporaryNode
  ) {}

  isSkippable(attr: string): boolean
  {
    for (let node = this.node; node; node = (node as TemporaryNode).next) {
      if (instanceOfTemporaryElement(node)) {
        return hasAttr(node, attr)
      } else {
        if (!/^\s*$/.test((node as TemporaryText).text)) {
          return false
        }
      }
    }
    return false
  }

  // Warning: This method should only be called when skippable
  skip(): this
  {
    while (true) {
      if (instanceOfTemporaryElement(this.node as TemporaryNode)) {
        return this
      }
      this.node = (this.node as TemporaryNode).next
    }
  }

  pop(): TemporaryNode | undefined
  {
    let node = this.node
    this.node = this.node && this.node.next
    return node
  }
}

function parseTree(node: TemporaryNode): Array<Template | string>
{
  return parseNodes(new DomLexer(node))
}

function parseNodes(lexer: DomLexer): Array<Template | string>
{
  let children = [] as Array<Template | string>
  while (lexer.node) {
    let result = parseNode(lexer)
    if (result !== undefined) {
      children.push(result as string | Template)
    }
  }
  return children
}

function parseNode(lexer: DomLexer): Template | string | void
{
  if (!lexer.node) {
    lexer.pop()
  } else if (instanceOfTemporaryElement(lexer.node)) {
    return parseTry(lexer)
  } else {
    return parseText((lexer.pop() as TemporaryText).text, true)
  }
}

function parseChild(lexer: DomLexer): Template
{
  return parseTry(lexer)
}

function parseTry(lexer: DomLexer): Template
{
  let el = lexer.node as TemporaryElement
  if (hasAttr(el, '@try')) {
    let value = parseFor(lexer)
    let template = { type: 'try', value } as TryTemplate
    if (lexer.isSkippable('@catch')) {
      template.failure = parseChild(lexer.skip())
    }
    return template
  } else {
    return parseFor(lexer)
  }
}

function parseFor(lexer: DomLexer): Template
{
  let el = lexer.node as TemporaryElement
  if (hasAttr(el, '@for')) {
    let each = getAttr(el, '@each') || undefined
    let array = expression(getAttr(el, '@for'))
    return { type: 'for', each, array, value: parseIf(lexer) } as ForTemplate
  } else {
    return parseIf(lexer)
  }
}

function parseIf(lexer: DomLexer): Template
{
  let el = lexer.node as TemporaryElement
  if (hasAttr(el, '@if')) {
    let condition = expression(getAttr(el, '@if'))
    let truthy = parseBind(lexer)
    let template = { type: 'if', condition, truthy } as IfTemplate
    if (lexer.isSkippable('@else')) {
      template.falsy = parseChild(lexer.skip())
    }
    return template
  } else {
    return parseBind(lexer)
  }
}

function parseBind(lexer: DomLexer): Template
{
  let el = lexer.node as TemporaryElement
  if (hasAttr(el, '@bind')) {
    let name = getAttr(el, '@bind')
    let template = { type: 'bind', name } as BindTemplate
    let to = getAttr(el, '@to')
    if (to) {
      template.to = expression(to)
    }
    template.value = parseLet(lexer)
    return template
  } else {
    return parseLet(lexer)
  }
}

function parseLet(lexer: DomLexer): Template {
  let el = lexer.node as TemporaryElement
  if (el.tag === 'let') {
    let template = {
      type: 'group',
    } as GroupTemplate
    lexer.pop()
    let children = parseNodes(lexer)
    if (children.length) {
      template.children = children
    }
    return template
  } else {
    return parseGroup(lexer.pop() as TemporaryElement)
  }
}

function parseGroup(el: TemporaryElement): Template
{
  if (el.tag === 'group') {
    let template = {
      type: 'group',
    } as GroupTemplate
    if (el.attrs) {
      el.attrs.forEach(([name,, value]) => {
        // syntax attribute
        if (name.match(/^@(if|else|for|each|bind|to)$/)) return
        if (name.match(/^@.*$/)) {
          if (!template.attrs) {
            template.attrs = {} as Record<string, unknown | Template>
          }
          (template.attrs as Record<string, unknown | Template>)[name] = value
        }
      })
    }
    if (el.child) {
      let children = parseTree(el.child)
      if (children.length) {
        template.children = children
      }
    }
    return template
  } else {
    return parseElement(el)
  }
}

function parseElement(el: TemporaryElement): ElementTemplate | CustomElementTemplate
{
  let template = {
    type: 'element',
    tag: el.tag,
  } as ElementTemplate | CustomElementTemplate

  {
    let style = [] as Array<string | Template>
    if (el.attrs) {
      el.attrs.forEach(([name, assign, value]) => {
        switch (assign) {
          case '=': { // template attribute
            let parsedValue = parseText(value)
            switch (name) {
              case 'is': {
                if (!(name in template)) {
                  template.is = parsedValue
                }
                return
              }
              case 'class':
              case 'part': {
                let values = (typeof parsedValue === 'string' || parsedValue.type !== 'join') ? [parsedValue] : parsedValue.values
                if (!template[name]) {
                  template[name] = []
                }
                values.forEach(value => {
                  if (typeof value === 'string') {
                    if (value) {
                      (template[name] as string[][]).push(value.split(/\s+/).filter(v => v))
                    }
                  } else if (instanceOfTemplate(value)){
                    (template[name] as SplitTemplate[]).push({ type: 'split', value, separator: ' ' })
                  }
                })
                return
              }
              case 'style': {
                return style.push(parsedValue)
              }
            }
            if (!template.attrs) {
              template.attrs = {}
            }
            if (!(name in template.attrs)) {
              return (template.attrs as Record<string, unknown | Template>)[name] = parsedValue
            }
            return
          }

          case ':=': {// assign attribute
            switch (name) {
              case 'is':
                return template.is = expression(value)
              case 'class':
              case 'part': {
                if (!template[name]) {
                  template[name] = []
                }
                return (template[name] as FlagsTemplate[])
                  .push({ type: 'flags', value: expression(value) } as FlagsTemplate)
              }
              case 'style': {
                return style.push(expression(value))
              }
            }
            if (!template.attrs) {
              template.attrs = {}
            }
            return template.attrs[name] = expression(value)
          }

          case '*=': { // ref attribute
            let ref = expression(value)
            if (instanceOfTemplate(ref) && ref.type === 'get') {
              ref = (ref as GetTemplate).value
            }
            if (!template.attrs) {
              template.attrs = {}
            }
            return template.attrs[name] = ref
          }

          case 'on': { // on attribute
            let type = name.slice(2)
            let handler = { type: 'handler', value: expression(value) } as HandlerTemplate
            if (!template.on) {
              template.on = {}
            }
            if (!template.on[type]) {
              template.on[type] = []
            }
            return template.on[type].push(handler)
          }

          case '@': {
            if (name === '@chunk') {
              if (!template.chunks) {
                template.chunks = []
              }
              return template.chunks.push(expression(value))
            }
          }
        }
      })
    }

    if (style.length) {
      if (style.length === 1 && typeof style[0] === 'string') {
        template.style = style[0]
      } else {
        template.style = { type: 'join', values: style.filter(value => value !== ''), separator: ';' } as JoinTemplate
      }
    }

     // boolean attribute
    if (el.attrs) {
      el.attrs.forEach(([name, assign, value]) => {
        if (assign === '&=') {
          if (!template.bools) {
            template.bools = {}
          }
          template.bools[name] = expression(value)
          if (template.attrs) {
            delete template.attrs[name]
            if (!Object.keys(template.attrs).length) {
              delete template.attrs
            }
          }
        }
      })
    }
  }

  if (el.child) {
    let children = parseTree(el.child)
    if (children.length) {
      template.children = children
    }
  }

  // custom element
  if (!isPrimitive(template.tag) || template.is) {
    template.type = 'custom'
  }

  return template
}

function hasAttr(el: TemporaryElement, attr: string): boolean
{
  return el.attrs && el.attrs.some(a => a[0] === attr)
}

function getAttr(el: TemporaryElement, attr: string): string
{
  let a = el.attrs && el.attrs.find(a => a[0] === attr)
  return a ? a[2] : ''
}

function parseText(text: string, isTree = false): Template | string
{
  let lexer: Lexer = new Lexer(text, 'text')
  let valuesTemp = [] as Array<string | Template>
  valuesTemp.push(lexer.skip())
  while (lexer.nextIs()) {
    if (lexer.nextIs('{{') || lexer.nextIs('{|')) {
      let start = lexer.pop() as Token
      lexer.expand('script', () => {
        let value = expression(lexer)
        valuesTemp.push(isTree ? { type: 'draw', value } : value)
      })
      if (start[0] === '{{') {
        lexer.must('}}')
      } else {
        lexer.must('|}')
      }
      valuesTemp.push(lexer.skip())
    } else {
      lexer.pop()
    }
  }
  let values = valuesTemp.filter(v => v)
  if (values.length === 0) {
    return ''
  } else if (values.length === 1 && (typeof values[0] === 'string' || !isTree)) {
    return values[0]
  } else if (isTree) {
    return { type: 'flat', values } as FlatTemplate
  } else {
    return { type: 'join', values } as JoinTemplate
  }
}
