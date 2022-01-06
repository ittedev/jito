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
  TreeTemplate,
  ExpandTemplate,
  GroupTemplate,
  CachedListenerTemplate,
  Ref,
  Evaluate,
  Evaluator
} from './types.ts'
import { Loop } from './loop.ts'
import { operateUnary, operateBinary } from './operate.ts'
import { pickup } from './pickup.ts'

export function evaluate(template: Template, stack: Variables = []): unknown {
  return evaluator[template.type](template, stack)
}

export const evaluator = {
  literal: (
    (template: LiteralTemplate, _stack: Variables): unknown => template.value
  ) as Evaluate,

  array: (
    (template: ArrayTemplate, stack: Variables): unknown =>
      template.values.map((value: Template) => evaluate(value, stack))
  ) as Evaluate,

  object: (
    (template: ObjectTemplate, stack: Variables): unknown =>
    template.entries
      .map(entry => entry.map(value => evaluate(value, stack)))
      .reduce((obj, [key, value]) => {
        obj[key as string | number] = value
        return obj
      }, {} as Record<string, unknown>)
    // Object.fromEntries(template.entries.map(entry => entry.map(value => evaluate(value, stack))))
  ) as Evaluate,

  variable: ((template: VariableTemplate, stack: Variables): unknown => {
    const [value, index] = pickup(stack, template.name)
    if (value) {
      return [ stack[index], template.name ] as Ref
    }
    return undefined
  }) as Evaluate,

  unary: (
    (template: UnaryTemplate, stack: Variables): unknown =>
      operateUnary(template.operator, evaluate(template.operand, stack))
  ) as Evaluate,

  binary: (
    (template: BinaryTemplate, stack: Variables): unknown =>
      operateBinary(template.operator, evaluate(template.left, stack), evaluate(template.right, stack))
  ) as Evaluate,
  
  assign: ((template: AssignTemplate, stack: Variables): unknown => {
      const value = evaluate(template.left, stack) as Ref
      if (!value) {
        throw Error(template.left ? (template.left as VariableTemplate).name : 'key' + ' is not defined')
      }
      
      const [ object, key ] = value
      const right = evaluate(template.right, stack)
      return object[key] = template.operator.length > 1 ? operateBinary(template.operator.slice(0, -1), object[key], right) : right
  }) as Evaluate,

  ['function']: (
    (template: FunctionTemplate, stack: Variables): unknown => {
      const func = evaluate(template.name, stack)
      if (typeof func === 'function') {
        return func(...template.params.map(param => evaluate(param, stack)))
      }
      throw Error(template.name.toString() + ' is not a function')
    }
  ) as Evaluate,

  hash: (
    (template: HashTemplate, stack: Variables): unknown => ([
      evaluate(template.object, stack) as Record<PropertyKey, unknown>,
      evaluate(template.key, stack) as PropertyKey
    ] as Ref)
  ) as Evaluate,

  get: (
    (template: GetTemplate, stack: Variables): unknown => {
      const value = evaluate(template.value, stack) as Ref
      return value ? value[0][value[1]] : value
    }
  ) as Evaluate,

  join: (
    (template: JoinTemplate, stack: Variables): string => {
      return template.values.reduce<string>((result: string, value: unknown | Template, index: number) => {
        if (instanceOfTemplate(value)) {
          const text = evaluate(value, stack)
          return result + (index ? template.separator : '') + (typeof text === 'object' ? JSON.stringify(text) : text as string)
        } else {
          return result + (index ? template.separator : '') + value
        }
      }, '')
    }
  ) as Evaluate,

  flags: (
    (template: FlagsTemplate, stack: Variables): Array<string> => {
      const value = evaluate(template.value, stack)

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
    (template: IfTemplate, stack: Variables): unknown =>
      evaluate(template.condition, stack) ? evaluate(template.truthy, stack) : template.falsy ? evaluate(template.falsy, stack) : null
  ) as Evaluate,

  for: (
    (template: ForTemplate, stack: Variables): unknown => {
      const array = evaluate(template.array, stack)
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
        // TODO: add key
        return flatwrap(evaluate(template.value, stack.concat([template.each ? { [template.each]: value, loop } : { loop }])))
      })
    }
  ) as Evaluate,

  element: (
    (template: ElementTemplate, stack: Variables): VirtualElement => {
      const el = evaluator.tree(template as TreeTemplate, stack) as VirtualElement
      el.tag = template.tag

      if (template.is) {
        el.is = typeof template.is === 'string' ? template.is : evaluate(template.is, stack) as string
      }
      evaluateProps(template, stack, el)

      return el
    }
  ) as Evaluate,
  
  tree: (
    (template: TreeTemplate, stack: Variables): VirtualTree => {
      const children: Array<string | VirtualElement | number> = (template.children || [])?.flatMap(child => {
        if (typeof child === 'string') {
          return [child]
        } else {
          return flatwrap(evaluate(child, stack)) as Array<string | VirtualElement | number>
        }
      })
      if (children.length) {
        return { children }
      } else {
        return {}
      }
    }
  ) as Evaluate,

  expand: (
    (template: ExpandTemplate, stack: Variables): unknown => {
      const result = evaluate(template.template, stack)
      if (instanceOfTemplate(result)) {
        if (result.type === 'tree') {
          result.type = 'group'
        }
        return evaluate(result, stack)
      } else {
        return evaluate(template.default, stack)
      }
    }
  ) as Evaluate,

  group: (
    (template: GroupTemplate, stack: Variables): Array<unknown> =>
      template.children ? template.children.flatMap(child => flatwrap(instanceOfTemplate(child) ? evaluate(child, stack) : child)) : []
  ) as Evaluate,

  listener: (
    (template: CachedListenerTemplate, stack: Variables): EventListener => {
      if (!template.cache) {
        template.cache = []
      }
      for (const cache of template.cache) {
        if (compareCache(cache[0], stack)) {
          return cache[1]
        }
      }
      const listener = () => evaluate(template.value, stack) as void
      template.cache.push([stack, listener])
      return listener
    }
  ) as Evaluate

} as Evaluator

export function evaluateProps(template: ElementTemplate, stack: Variables, ve: VirtualElement): void {
  if (template.style) {
    ve.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack) as string
  }

  if (template.props) {
    if (!ve.props) {
      ve.props = {}
    }
    for (const key in template.props) {
      const props = template.props[key]
      ve.props[key] = typeof props === 'string' ? props : evaluate(props as Template, stack)
    }
  }

  if (template.class) {
    template.class.forEach(value =>
      ve.class = (ve.class || []).concat(Array.isArray(value) ? value as Array<string> : evaluate(value, stack) as Array<string>)
    )
  }

  if (template.part) {
    template.part.forEach(value =>
      ve.part = (ve.part || []).concat(Array.isArray(value) ? value as Array<string> : evaluate(value, stack) as Array<string>)
    )
  }

  if (template.on) {
    if (!ve.on) {
      ve.on = {}
    }
    for (const type in template.on) {
      ve.on[type] = template.on[type].map(listener => evaluate(listener, stack) as EventListener)
    }
  }
}

function compareCache(cache: Variables, stack: Variables, cacheIndex: number = cache.length - 1, stackIndex: number = stack.length - 1): boolean {
  const [cacheLoop, newCacheIndex] = pickup(cache, 'loop', cacheIndex) as [Loop | undefined, number]
  const [stackLoop, newStackIndex] = pickup(stack, 'loop', stackIndex) as [Loop | undefined, number]
  
  if (!cacheLoop && !stackLoop) return true
  if (!cacheLoop || !stackLoop) return false

  return cacheLoop.index === stackLoop.index && 
    cacheLoop.key === stackLoop.key && 
    cacheLoop.value === stackLoop.value &&
    compareCache(cache, stack, newCacheIndex,  newStackIndex)
}
function flatwrap(value: unknown): Array<unknown> {
  return value === null || value === undefined ?
    [] :
    Array.isArray(value) ? value : [value]
}
