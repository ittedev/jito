// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, VirtualTree } from '../virtual_dom/types.ts'
import {
  Variables,
  Template,
  instanceOfTemplate,
  LiteralTemplate,
  ArrayTemplate,
  ObjectTemplate,
  VariableTemplate,
  UnaryTemplate,
  BinaryTemplate,
  AssignTemplate,
  FunctionTemplate,
  HashTemplate,
  GetTemplate,
  JoinTemplate,
  FlagsTemplate,
  IfTemplate,
  ForTemplate,
  ElementTemplate,
  HasChildrenTemplate,
  TreeTemplate,
  ExpandTemplate,
  GroupTemplate,
  HandlerTemplate,
  Cache,
  Ref,
  Evaluate,
  CoreTemplate,
  Evaluator
} from './types.ts'
import { Loop } from './loop.ts'
import { operateUnary, noCut, operateBinary } from './operate.ts'
import { pickup } from './pickup.ts'

export function evaluate(template: Template, stack: Variables = [], cache: Cache = {}): unknown {
  return evaluator[template.type](template, stack, cache)
}

export const evaluator = {
  literal: (
    (template: LiteralTemplate, _stack: Variables, _cache: Cache): unknown => template.value
  ) as Evaluate,

  array: (
    (template: ArrayTemplate, stack: Variables, cache: Cache): unknown =>
      template.values.map((value: Template) => evaluate(value, stack, cache))
  ) as Evaluate,

  object: (
    (template: ObjectTemplate, stack: Variables, cache: Cache): unknown =>
    template.entries
      .map(entry => entry.map(value => evaluate(value, stack, cache)))
      .reduce((obj, [key, value]) => {
        obj[key as string | number] = value
        return obj
      }, {} as Record<string, unknown>)
    // Object.fromEntries(template.entries.map(entry => entry.map(value => evaluate(value, stack))))
  ) as Evaluate,

  variable: ((template: VariableTemplate, stack: Variables, _cache: Cache): unknown => {
    const [, index] = pickup(stack, template.name)
    if (index >= 0) {
      return [ stack[index], template.name ] as Ref
    }
    return undefined
  }) as Evaluate,

  unary: (
    (template: UnaryTemplate, stack: Variables, cache: Cache): unknown =>
      operateUnary(template.operator, evaluate(template.operand, stack, cache))
  ) as Evaluate,

  binary: (
    (template: BinaryTemplate, stack: Variables, cache: Cache): unknown => {
      const left = evaluate(template.left, stack, cache)
      if (noCut(template.operator, left)) {
        return operateBinary(template.operator, left, evaluate(template.right, stack, cache))
      } else {
        return left
      }
    }
  ) as Evaluate,

  assign: ((template: AssignTemplate, stack: Variables, cache: Cache): unknown => {
    const value = evaluate(template.left, stack, cache) as Ref
    if (!value) {
      throw Error(template.left ? (template.left as VariableTemplate).name : 'key' + ' is not defined')
    }

    const [ object, key ] = value
    const right = evaluate(template.right, stack, cache)
    if (template.operator.length > 1) {
      const operator = template.operator.slice(0, -1)
      if (noCut(operator, object[key])) {
        return object[key] = operateBinary(operator, object[key], right)
      } else {
        return object[key]
      }
    } else {
      return object[key] = right
    }
  }) as Evaluate,

  ['function']: (
    (template: FunctionTemplate, stack: Variables, cache: Cache): unknown => {
      if (template.name.type === 'get' && (template.name as GetTemplate).value.type === 'hash') {
        // method
        const value = evaluate((template.name as GetTemplate).value, stack, cache) as Ref
        if (!value) {
          throw Error(evaluate(((template.name as GetTemplate).value as HashTemplate).key, stack, cache) as string + ' is not defined')
        }
        const f = value[0][value[1]]
        if (typeof f === 'function') {
          return f.apply(value[0], template.params.map(param => evaluate(param, stack, cache)))
        }
      } else {
        // other
        const f = evaluate(template.name, stack, cache)
        if (typeof f === 'function') {
          return f(...template.params.map(param => evaluate(param, stack, cache)))
        }
      }
      throw Error(template.name.toString() + ' is not a function')
    }
  ) as Evaluate,

  hash: (
    (template: HashTemplate, stack: Variables, cache: Cache): unknown => ([
      evaluate(template.object, stack, cache) as Record<PropertyKey, unknown>,
      evaluate(template.key, stack, cache) as PropertyKey
    ] as Ref)
  ) as Evaluate,

  get: (
    (template: GetTemplate, stack: Variables, cache: Cache): unknown => {
      const value = evaluate(template.value, stack, cache) as Ref
      return value ? value[0][value[1]] : value
    }
  ) as Evaluate,

  join: (
    (template: JoinTemplate, stack: Variables, cache: Cache): string => {
      return template.values.reduce<string>((result: string, value: unknown | Template, index: number) => {
        if (instanceOfTemplate(value)) {
          const text = evaluate(value, stack, cache)
          return result + (index ? template.separator : '') + (typeof text === 'object' ? JSON.stringify(text) : text as string)
        } else {
          return result + (index ? template.separator : '') + value
        }
      }, '')
    }
  ) as Evaluate,

  flags: (
    (template: FlagsTemplate, stack: Variables, cache: Cache): Array<string> => {
      const value = evaluate(template.value, stack, cache)

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
    }) as Evaluate,

  ['if']: (
    (template: IfTemplate, stack: Variables, cache: Cache): unknown =>
      evaluate(template.condition, stack, cache) ? evaluate(template.truthy, stack, cache) : template.falsy ? evaluate(template.falsy, stack, cache) : null
  ) as Evaluate,

  for: (
    (template: ForTemplate, stack: Variables, cache: Cache): unknown => {
      const array = evaluate(template.array, stack, cache)
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
        const result = (flatwrap(evaluate(template.value, stack.concat([template.each ? { [template.each]: value, loop } : { loop }]), cache)) as Array<string | VirtualElement | number>)
          .filter(child => typeof child !== 'number')
        if (typeof loop.value === 'object') {
          result
            .filter(child => typeof child === 'object')
            .forEach(child => (child as VirtualElement).key = loop.value)
        }
        return result
      })
    }
  ) as Evaluate,

  element: (
    (template: ElementTemplate, stack: Variables, cache: Cache): VirtualElement => {
      const el = evaluator.tree(template as TreeTemplate, stack, cache) as VirtualElement
      el.tag = template.tag

      if (template.is) {
        el.is = typeof template.is === 'string' ? template.is : evaluate(template.is, stack, cache) as string
      }
      evaluateProps(template, stack, cache, el)

      return el
    }
  ) as Evaluate,

  tree: (
    (template: TreeTemplate, stack: Variables, cache: Cache): VirtualTree => {
      const children = evaluateChildren(template, stack, cache)
      return children.length ? { children } : {}
    }
  ) as Evaluate,

  expand: (
    (template: ExpandTemplate, stack: Variables, cache: Cache): unknown => {
      const result = evaluate(template.template, stack, cache)
      if (instanceOfTemplate(result)) {
        if (result.type === 'tree') {
          result.type = 'group'
        }
        return evaluate(result, stack, cache)
      } else {
        return evaluate(template.default, stack, cache)
      }
    }
  ) as Evaluate,

  group: (
    (template: GroupTemplate, stack: Variables, cache: Cache): Array<unknown> => evaluateChildren(template, stack, cache)
  ) as Evaluate,

  handler: (
    (template: HandlerTemplate, stack: Variables, cache: Cache): EventListener => {
      if (!cache.handler) {
        cache.handler = new WeakMap<HandlerTemplate, Array<[Variables, EventListener]>>()
      }
      if (!cache.handler.has(template)) {
        cache.handler.set(template, [])
      }
      const thisHandlerCache = cache.handler.get(template) as Array<[Variables, EventListener]>
      for (const cache of thisHandlerCache) {
        if (compareCache(cache[0], stack)) {
          return cache[1]
        }
      }
      const handler = (event: Event) => evaluate(template.value, [...stack, { event }], cache) as void
      thisHandlerCache.push([stack, handler])
      return handler
    }
  ) as Evaluate

} as Evaluator

export function evaluateChildren(template: HasChildrenTemplate, stack: Variables, cache: Cache): Array<string | VirtualElement | number> {
  const children = (template.children || []) as Array<Template | string>
  let i = 0
  if (children.length) {
    if ((cache.groups ?? (cache.groups = [new WeakMap<Template, number>(), 0]))[0].has(template)) {
      i = cache.groups[0].get(template) as number
    } else {
      i = cache.groups[1] = cache.groups[1] + children.length
      cache.groups[0].set(template, i)
    }
  }
  const result = children.flatMap((child, index) => {
    if (instanceOfTemplate(child)) {
      const result = flatwrap(evaluate(child, stack, cache)) as Array<string | VirtualElement | number>
      switch ((child as CoreTemplate).type) {
        case 'if': case 'for': case 'expand': case 'group':
          result.push(i - index)
      }
      return result
    } else {
      return [child] as Array<string | VirtualElement | number>
    }
  })
  if (typeof result[result.length - 1] === 'number') {
    result.pop()
  }
  return result
}

export function evaluateProps(template: ElementTemplate, stack: Variables, cache: Cache, ve: VirtualElement): void {
  if (template.style) {
    ve.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack, cache) as string
  }

  if (template.bools) {
    for (const key in template.bools) {
      const value = template.bools[key]
      const result = typeof value === 'string' ? value : evaluate(value as Template, stack, cache)
      if (result) {
        (ve.props ?? (ve.props = {}))[key] = result
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
