// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  RealTarget,
  VirtualElement,
  VirtualTree
} from '../virtual_dom/types.ts'
import {
  isRef,
  Variables,
  Template,
  HasChildrenTemplate,
  HasAttrTemplate,
  instanceOfTemplate,
  ObjectTemplate,
  VariableTemplate,
  HashTemplate,
  GetTemplate,
  JoinTemplate,
  ForTemplate,
  HandlerTemplate,
  CustomTemplate,
  CustomElementTemplate,
  Cache,
  Evaluate,
  EvaluatePlugin,
  Ref,
} from './types.ts'
import { Loop } from './loop.ts'
import { pickup } from './pickup.ts'
import { isPrimitive } from './is_primitive.ts'

const plugins = new Array<EvaluatePlugin>()

export const evaluate = function (template: Template | CustomTemplate, stack: Variables = [], cache: Cache = {}): unknown {
  const temp = template as Template
  switch (temp.type) {
    case 'literal':
      return temp.value

    case 'array':
      return temp.values.map((value: Template) => evaluate(value, stack, cache))

    case 'object':
      return Object.fromEntries(
        (temp as ObjectTemplate).entries.map(entry => entry.map(value => evaluate(value, stack)))
      )

    case 'variable': {
      const [, index] = pickup(stack, (temp as VariableTemplate).name)
      if (index >= 0) {
        return { record: stack[index], key: (temp as VariableTemplate).name, [isRef]: true } as Ref
      }
      return undefined
    }

    case 'unary':
      return operateUnary(temp.operator, evaluate(temp.operand, stack, cache))

    case 'binary': {
      const left = evaluate(temp.left, stack, cache)
      if (noCut(temp.operator, left)) {
        return operateBinary(temp.operator, left, evaluate(temp.right, stack, cache))
      } else {
        return left
      }
    }

    case 'assign': {
      const value = evaluate(temp.left, stack, cache) as Ref
      if (!value) {
        throw Error(temp.left ? (temp.left as VariableTemplate).name : 'key' + ' is not defined')
      }

      const { record, key } = value
      const right = evaluate(temp.right, stack, cache)
      if (temp.operator.length > 1) {
        const operator = temp.operator.slice(0, -1)
        if (noCut(operator, record[key])) {
          return record[key] = operateBinary(operator, record[key], right)
        } else {
          return record[key]
        }
      } else {
        return record[key] = right
      }
    }

    case 'function': {
      if (temp.name.type === 'get' && (temp.name as GetTemplate).value.type === 'hash') {
        // method
        const value = evaluate((temp.name as GetTemplate).value, stack, cache) as Ref
        if (!value) {
          throw Error(evaluate(((temp.name as GetTemplate).value as HashTemplate).key, stack, cache) as string + ' is not defined')
        }
        const f = value.record[value.key]
        if (typeof f === 'function') {
          return f.apply(value.record, temp.params.map(param => evaluate(param, stack, cache)))
        }
      } else {
        // other
        const f = evaluate(temp.name, stack, cache)
        if (typeof f === 'function') {
          return f(...temp.params.map(param => evaluate(param, stack, cache)))
        }
      }
      throw Error(temp.name.toString() + ' is not a function')
    }

    case 'hash':
      return {
        record: evaluate(temp.object, stack, cache) as Record<PropertyKey, unknown>,
        key: evaluate(temp.key, stack, cache) as PropertyKey,
        [isRef]: true
      } as Ref

    case 'get': {
      const value = evaluate(temp.value, stack, cache) as Ref
      return value ? value.record[value.key] : value
    }

    case 'flat': {
      const values = temp.values.flatMap(
          (value: Template | string) =>
            typeof value === 'string' ?
              [value] :
              flatwrap(evaluate(value, stack, cache)) as Array<string | VirtualElement | RealTarget | number>
        )
        .filter(value => value !== '')
        .reduce<Array<string | VirtualElement | RealTarget | number>>((result, child) => {
          const len = result.length
          if (len && typeof child === 'string' && typeof result[len - 1] === 'string') {
            result[len - 1] += child
          } else {
            result.push(child)
          }
          return result
        }, [])

      if (values.length === 1 && typeof values[0] === 'string') {
        return values[0]
      } else {
        return values
      }
    }

    case 'draw': {
      const value = evaluate(temp.value, stack, cache)
      // if (value instanceof EventTarget) { // real element
      //   const el = {
      //     el: value
      //   } as RealElement
      //   return el
      // } else
      if (typeof value === 'object') {
        if (instanceOfTemplate(value)) { // expand
          if (value.type === 'tree') {
            (value as HasChildrenTemplate).type = 'group'
            const result = evaluate(value, stack, cache)
            value.type = 'tree'
            return result
          } else {
            return evaluate(value, stack, cache)
          }
        } else {
          return Object.getPrototypeOf(value) === Object.prototype ? JSON.stringify(value) : ''
        }
      } else {
        return value === null || value === undefined ? '' : value + ''
      }
    }

    case 'join':
      return temp.values.reduce<string>((result: string, value: unknown | Template, index: number) => {
        if (instanceOfTemplate(value)) {
          const text = evaluate(value, stack, cache)
          return result + (index ? (temp as JoinTemplate).separator : '') + (typeof text === 'object' ? '' : text as string)
        } else {
          return result + (index ? (temp as JoinTemplate).separator : '') + value
        }
      }, '')

    case 'flags': {
      const value = evaluate(temp.value, stack, cache)

      if (typeof value === 'string') {
        return value.split(/\s+/)
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value
        } else if (value) {
          return Object.keys(value).filter(key => (value as Record<string, unknown>)[key])
        }
      }
      return []
    }

    case 'if':
      return evaluate(temp.condition, stack, cache) ?
        evaluate(temp.truthy, stack, cache) :
        temp.falsy ?
          evaluate((temp.falsy as Template), stack, cache) :
          null

    case 'for': {
      const array = evaluate(temp.array, stack, cache)
      let entries: Array<[unknown, unknown]>
      if (typeof array === 'object' && array !== null) {
        if (Symbol.iterator in array) {
          if ('entries' in array) {
            entries = [...(array as Array<unknown> | Set<unknown> | Map<unknown, unknown> /* or TypedArray etc */).entries()]
          } else {
            let i = 0
            entries = []
            for (const value of array as Iterable<unknown>){
              entries.push([i++, value])
            }
          }
        } else {
          entries = Object.entries(array)
        }
      } else {
        entries = [[0, array]] // or errer?
      }
      return entries.flatMap(([key, value], index) => {
        const loop = new Loop(key, value, index, entries, stack)
        const result =
          (flatwrap(
            evaluate(
              (temp as ForTemplate).value,
              stack.concat([(temp as ForTemplate).each ? { [((temp as ForTemplate).each as string)]: value, loop } : { loop }]),
              cache
            )
          ) as Array<string | VirtualElement | RealTarget | number>)
          .filter(child => typeof child !== 'number')
        if (typeof loop.value === 'object') {
          result
            .filter(child => typeof child === 'object')
            .forEach(child => (child as VirtualElement).key = loop.value)
        }
        return result
      })
    }

    case 'tree': {
      const children = evaluateChildren(temp, stack, cache)
      return children.length ? { children } : {}
    }

    // deno-lint-ignore no-fallthrough
    case 'custom': {
      const el = plugins.find(plugin => plugin.match(temp, stack, cache))?.exec(temp, stack, cache)
      if (el) {
        return el
      }
    }

    case 'element': {
      const children = evaluateChildren(temp, stack, cache)
      const tree: VirtualTree = children.length ? { children } : {}
      const el = (tree as VirtualElement)

      el.tag = temp.tag

      if (temp.is) {
        el.is = typeof temp.is === 'string' ? temp.is : evaluate(temp.is, stack, cache) as string
      }
      evaluateProps(temp, stack, cache, el)

      return el
    }

    case 'group':
      return evaluateChildren(temp, stack, cache)

    case 'handler': {
      if (!cache.handler) {
        cache.handler = new WeakMap<HandlerTemplate, Array<[Variables, EventListener]>>()
      }
      if (!cache.handler.has(temp)) {
        cache.handler.set(temp, [])
      }
      const thisHandlerCache = cache.handler.get(temp) as Array<[Variables, EventListener]>
      for (const cache of thisHandlerCache) {
        if (compareCache(cache[0], stack)) {
          return cache[1]
        }
      }
      const handler = (event: Event) => evaluate((temp as HandlerTemplate).value, [...stack, { event }], cache) as void
      thisHandlerCache.push([stack, handler])
      return handler
    }

    case 'evaluation':
      return evaluate(
        temp.template,
        temp.stack ? temp.stack.concat(stack) : stack,
        cache
      )
    default:
      return plugins.find(plugin => plugin.match(template as CustomTemplate, stack, cache))?.exec(template as CustomTemplate, stack, cache)
  }
} as Evaluate

evaluate.plugin = function(plugin: EvaluatePlugin) {
  plugins.unshift(plugin)
}

const realElementPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: Variables,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      const temp = template as CustomElementTemplate
      if (!isPrimitive(temp.tag)) {
        return temp.tag === 'window' || pickup(stack, temp.tag)[0] instanceof EventTarget
      }
    }
    return false
  },
  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: Variables,
    cache: Cache
  ): RealTarget
  {
    const temp = template as CustomElementTemplate
    if (template.tag === 'window') {
      // console.log('template.tag:', template.tag)
      const re = {
        el: window,
        invalid: {
          props: true,
          children: true
        }
      }
      evaluateProps(temp, stack, cache, re)
      return re
    }
    const el = pickup(stack, temp.tag)[0] as Element | DocumentFragment | ShadowRoot | EventTarget
    const re = { el } as RealTarget
    evaluateProps(temp, stack, cache, re)
    if (
      (
        el instanceof Element ||
        el instanceof DocumentFragment ||
        el instanceof ShadowRoot
      ) &&
      temp.children &&
      temp.children.length
    ) {
      re.children = evaluateChildren(temp, stack, cache)
    } else {
      re.invalid = {
        children: true
      }
    }
    return re
  }
}

evaluate.plugin(realElementPlugin)

export function evaluateChildren(template: HasChildrenTemplate, stack: Variables, cache: Cache): Array<string | VirtualElement | RealTarget | number> {
  const children = (template.children || []) as Array<Template | string>

  // Cache number
  let i = 0
  if (children.length) {
    if ((cache.groups ?? (cache.groups = [new WeakMap<HasChildrenTemplate, number>(), 0]))[0].has(template)) {
      i = cache.groups[0].get(template) as number
    } else {
      i = cache.groups[1] = cache.groups[1] + children.length
      cache.groups[0].set(template, i)
    }
  }

  const result = children
    .flatMap((child, index) => {
      if (instanceOfTemplate(child)) {
        const result = (flatwrap(evaluate(child, stack, cache)) as Array<string | VirtualElement | RealTarget | number>)
        switch ((child as Template).type) {
          case 'if': case 'for': case 'group':
            result.push(i - index)
        }
        return result
      } else {
        return [child] as Array<string | VirtualElement | RealTarget | number>
      }
    })
  if (typeof result[result.length - 1] === 'number') {
    result.pop()
  }
  return result
}

export function evaluateProps(template: HasAttrTemplate, stack: Variables, cache: Cache, ve: VirtualElement | RealTarget): void {
  if (template.style) {
    ve.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack, cache) as string
  }

  if (template.bools) {
    for (const key in template.bools) {
      if (!key.startsWith('@')) { // Remove syntax attributes
        const value = template.bools[key]
        const result = typeof value === 'string' ? value : evaluate(value as Template, stack, cache)
        if (result) {
          (ve.props ?? (ve.props = {}))[key] = result
        }
      }
    }
  }

  if (template.props) {
    if (!ve.props) {
      ve.props = {}
    }
    for (const key in template.props) {
      if (!key.startsWith('@')) { // Remove syntax attributes
        const value = template.props[key]
        ve.props[key] = typeof value === 'string' ? value : evaluate(value as Template, stack, cache)
      }
    }
  }

  if (template.class) {
    template.class.forEach(value =>
      ve.class = (ve.class || []).concat(Array.isArray(value) ? value as Array<string> : evaluate(value, stack, cache) as Array<string>)
    )
  }

  if (template.part) {
    template.part.forEach(value =>
      ve.part = (ve.part || []).concat(Array.isArray(value) ? value as Array<string> : evaluate(value, stack, cache) as Array<string>)
    )
  }

  if (template.on) {
    if (!ve.on) {
      ve.on = {}
    }
    for (const type in template.on) {
      ve.on[type] = template.on[type].map(listener => evaluate(listener, stack, cache) as EventListener)
    }
  }
}

function compareCache(
  cache: Variables,
  stack: Variables,
  cacheIndex: number = cache.length - 1,
  stackIndex: number = stack.length - 1
): boolean {
  const [cacheLoop, newCacheIndex] = pickup(cache, 'loop', cacheIndex) as [Loop | undefined, number]
  const [stackLoop, newStackIndex] = pickup(stack, 'loop', stackIndex) as [Loop | undefined, number]

  if (!cacheLoop && !stackLoop) return true
  if (!cacheLoop || !stackLoop) return false

  return cacheLoop.index === stackLoop.index &&
    cacheLoop.key === stackLoop.key &&
    cacheLoop.value === stackLoop.value &&
    compareCache(cache, stack, newCacheIndex - 1,  newStackIndex - 1)
}

function flatwrap(value: unknown): Array<unknown> {
  return value === null || value === undefined ?
    [] :
    Array.isArray(value) ? value : [value]
}

// deno-lint-ignore no-explicit-any
export function operateUnary(operator: string, operand: any) {
  switch (operator) {
    case 'void': return void operand
    case 'typeof': return typeof operand
    case '+': return +operand
    case '-': return -operand
    case '~': return ~operand
    case '!': return !operand
    default: throw Error(operator + ' does not exist')
  }
}

// deno-lint-ignore no-explicit-any
export function noCut(operator: string, left: any): boolean {
  switch (operator) {
    case '&&': return !!left
    case '||': return !left
    case '??': return left === null || left === undefined
    default: return true
  }
}

// deno-lint-ignore no-explicit-any
export function operateBinary(operator: string, left: any, right: any) {
  switch (operator) {
    // Arithmetic operators
    case '+': return left + right
    case '-': return left - right
    case '/': return left / right
    case '*': return left * right
    case '%': return left % right
    case '**': return left ** right

    // Relational operators
    case 'in': return left in right
    case 'instanceof': return left instanceof right
    case '<': return left < right
    case '>': return left > right
    case '<=': return left <= right
    case '>=': return left >= right

    // Equality operators
    case '==': return left == right
    case '!=': return left != right
    case '===': return left === right
    case '!==': return left !== right

    // Bitwise shift operators
    case '<<': return left << right
    case '>>': return left >> right
    case '>>>': return left >>> right

    // Binary bitwise operators
    case '&': return left & right
    case '|': return left | right
    case '^': return left ^ right

    // Binary logical operators
    case '&&': return left && right
    case '||': return left || right
    case '??': return left ?? right

    // Other operators
    default: throw Error(operator + ' does not exist')
  }
}