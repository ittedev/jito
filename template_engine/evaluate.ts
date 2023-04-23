import {
  RealTarget,
  VirtualElement,
  VirtualTree
} from '../virtual_dom/types.ts'
import {
  isRef,
  StateStack,
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
import { pickup, pickupIndex } from './pickup.ts'
import { isPrimitive } from './is_primitive.ts'

let plugins = new Array<EvaluatePlugin>()

export let evaluate = function (
  template: Template | CustomTemplate,
  stack: StateStack = [],
  cache: Cache = {}
): unknown
{
  let temp = template as Template
  switch (temp.type) {
    case 'literal':
      return temp.value

    case 'array':
      return temp.values.map((value: Template) => evaluate(value, stack, cache))

    case 'object':
      return (temp as ObjectTemplate).entries
        .map(entry => entry.map(value => evaluate(value, stack)))
        .reduce<Record<string, unknown>>((obj, entry) => {
          obj[entry[0] as string] = entry[1]
          return obj
        }, {})
      // return Object.fromEntries(
      //   (temp as ObjectTemplate).entries.map(entry => entry.map(value => evaluate(value, stack)))
      // )

    case 'variable': {
      let [, index] = pickupIndex(stack, (temp as VariableTemplate).name)
      if (index >= 0) {
        return { record: stack[index], key: (temp as VariableTemplate).name, [isRef]: true } as Ref
      }
      return undefined
    }

    case 'unary':
      return operateUnary(temp.operator, evaluate(temp.operand, stack, cache))

    case 'binary': {
      let left = evaluate(temp.left, stack, cache)
        if (continueEvaluation(temp.operator, left)) {
        return operateBinary(temp.operator, left, evaluate(temp.right, stack, cache))
      } else {
        return left
      }
    }

    case 'assign': {
      let value = evaluate(temp.left, stack, cache) as Ref
      if (!value) {
        throw Error(temp.left ? (temp.left as VariableTemplate).name : 'key' + ' is not defined')
      }

      let { record, key } = value

      // Skip Prototype Pollution
      if (typeof record === 'function' || (record as unknown) === Object) {
        throw Error('Cannot assign to this object')
      }
      if (key === '__proto__') {
          throw Error('Cannot assign to ' + key)
      }

      let prevalue = record[key]

      // Skip Prototype Pollution
      if (typeof prevalue === 'function') {
        throw Error('Cannot assign to function')
      }

      let right = evaluate(temp.right, stack, cache)

      if (temp.operator.length > 1) {
        let operator = temp.operator.slice(0, -1)
        if (continueEvaluation(operator, prevalue)) {
          record[key] = operateBinary(operator, prevalue, right)
        }
      } else {
        record[key] = right
      }
      return temp.prevalue ? prevalue : record[key]
    }

    case 'function': {
      if (temp.name.type === 'get' && (temp.name as GetTemplate).value.type === 'hash') {
        // method
        let value = evaluate((temp.name as GetTemplate).value, stack, cache) as Ref
        if (!value) {
          throw Error(evaluate(((temp.name as GetTemplate).value as HashTemplate).key, stack, cache) as string + ' is not defined')
        }
        switch(value.key) {
          case '__defineGetter__':
          case '__defineSetter__':
            throw Error('Cannot get ' + value.key)
        }
        let f = value.record[value.key]
        if (typeof f === 'function') {
          return f.apply(value.record, temp.params.map(param => evaluate(param, stack, cache)))
        }
      } else {
        // other
        let f = evaluate(temp.name, stack, cache)
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
      let value = evaluate(temp.value, stack, cache) as Ref
      if (value) {
        if (value.key === '__proto__') {
          throw Error('Cannot get ' + value.key)
        }
        return value.record[value.key]
      } else {
        return value
      }
    }

    case 'flat': {
      let values = temp.values.map(
          (value: Template | string) =>
            typeof value === 'string' ?
              [value] :
              flatwrap(evaluate(value, stack, cache)) as Array<string | VirtualElement | RealTarget | number>
        )
        .reduce<Array<string | VirtualElement | RealTarget | number>>((ary, values) => { // flatMap
          ary.push(...values)
          return ary
        },[])
        .filter(value => value !== '')
        .reduce<Array<string | VirtualElement | RealTarget | number>>((result, child) => {
          let len = result.length
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
      let value = evaluate(temp.value, stack, cache)
      if (typeof value === 'object') {
        if (instanceOfTemplate(value)) { // expand
          if (value.type === 'tree') {
            (value as HasChildrenTemplate).type = 'group'
            let result = evaluate(value, stack, cache)
            value.type = 'tree'
            return result
          } else {
            return evaluate(value, stack, cache)
          }
        } else {
          return value !== null && Object.getPrototypeOf(value) === Object.prototype ? JSON.stringify(value) : ''
        }
      } else {
        return value === null || value === undefined ? '' : value + ''
      }
    }

    case 'join':
      return temp.values.reduce<string>((result: string, value: unknown | Template, index: number) => {
        if (instanceOfTemplate(value)) {
          let text = evaluate(value, stack, cache)
          return result + (index ? (temp as JoinTemplate).separator : '') + (typeof text === 'object' ? '' : text as string)
        } else {
          return result + (index ? (temp as JoinTemplate).separator : '') + value
        }
      }, '')

    case 'flags': {
      let value = evaluate(temp.value, stack, cache)

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

    case 'try':
      try {
        return evaluate(temp.value, stack, cache)
      } catch {
        return temp.failure?
          evaluate((temp.failure as Template), stack, cache) :
          null
      }

    case 'if':
      return evaluate(temp.condition, stack, cache) ?
        evaluate(temp.truthy, stack, cache) :
        temp.falsy ?
          evaluate((temp.falsy as Template), stack, cache) :
          null

    case 'for': {
      let array = evaluate(temp.array, stack, cache)
      let entries: Array<[unknown, unknown]>
      if (typeof array === 'object' && array !== null) {
        if (Symbol.iterator in array) {
          if ('entries' in array) {
            entries = [...(array as Array<unknown> | Set<unknown> | Map<unknown, unknown> /* or TypedArray etc */).entries()]
          } else {
            let i = 0
            entries = []
            for (let value of array as Iterable<unknown>){
              entries.push([i++, value])
            }
          }
        } else {
          entries = Object.entries(array)
        }
      } else {
        entries = [[0, array]] // or errer?
      }
      return entries
        .map(([key, value], index) => {
          let loop = new Loop(key, value, index, entries, stack)
          let result =
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
        .reduce((ary, values) => { // flatMap
          ary.push(...values)
          return ary
        }, [])
    }

    case 'tree': {
      let children = evaluateChildren(temp, stack, cache)
      return children.length ? { children } : {}
    }

    // deno-lint-ignore no-fallthrough
    case 'custom': {
      let plugin = plugins.find(plugin => plugin.match(temp as CustomElementTemplate | CustomTemplate, stack, cache))
      let el = plugin ? plugin.exec(temp, stack, cache) : undefined
      if (el) {
        return el
      }
    }

    case 'element': {
      let children = evaluateChildren(temp, stack, cache)
      let tree: VirtualTree = children.length ? { children } : {}
      let el = (tree as VirtualElement)

      el.tag = temp.tag

      if (temp.is) {
        el.is = typeof temp.is === 'string' ? temp.is : evaluate(temp.is, stack, cache) as string
      }
      evaluateAttrs(temp, stack, cache, el)

      return el
    }

    case 'group':
      return evaluateChildren(temp, stack, cache)

    case 'handler': {
      if (!cache.handler) {
        cache.handler = new WeakMap<HandlerTemplate, Array<[StateStack, EventListener]>>()
      }
      if (!cache.handler.has(temp)) {
        cache.handler.set(temp, [])
      }
      let thisHandlerCache = cache.handler.get(temp) as Array<[StateStack, EventListener]>
      for (let cache of thisHandlerCache) {
        if (compareCache(cache[0], stack)) {
          return cache[1]
        }
      }
      let handler = (event: Event) => evaluate((temp as HandlerTemplate).value, [...stack, { event }], cache) as void
      thisHandlerCache.push([stack, handler])
      return handler
    }

    case 'evaluation':
      return evaluate(temp.value, stack, cache)

    default: {
      let plugin = plugins.find(plugin => plugin.match(template as CustomTemplate, stack, cache))
      return plugin ? plugin.exec(template as CustomTemplate, stack, cache) : undefined
    }
  }
} as Evaluate

evaluate.plugin = (plugin: EvaluatePlugin) => {
  plugins.unshift(plugin)
}

let realElementPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      let temp = template as CustomElementTemplate
      if (!isPrimitive(temp.tag)) {
        return temp.tag === 'window' || pickup(stack, temp.tag) instanceof EventTarget
      }
    }
    return false
  },
  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    cache: Cache
  ): RealTarget
  {
    let temp = template as CustomElementTemplate
    if (template.tag === 'window') {
      let re = {
        el: window,
        override: true,
        invalid: {
          attrs: true,
          children: true
        }
      }
      evaluateAttrs(temp, stack, cache, re)
      return re
    }
    let el = pickup(stack, temp.tag) as Element | DocumentFragment | ShadowRoot | EventTarget
    let re = { el } as RealTarget
    evaluateAttrs(temp, stack, cache, re)
    if (el instanceof Element && temp.attrs) {
      if ('@override' in temp.attrs) {
        re.override = true
      }
    }
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

export function evaluateChildren(
  template: HasChildrenTemplate,
  stack: StateStack,
  cache: Cache
): Array<string | VirtualElement | RealTarget | number>
{
  let children = (template.children || []) as Array<Template | string>

  // Cache number
  let i = 0
  if (children.length) {
    if (!cache.groups) {
      cache.groups = [new WeakMap<HasChildrenTemplate, number>(), 0]
    }
    if (cache.groups[0].has(template)) {
      i = cache.groups[0].get(template) as number
    } else {
      i = cache.groups[1] = cache.groups[1] + children.length
      cache.groups[0].set(template, i)
    }
  }

  let result = children
    .map((child, index) => {
      if (instanceOfTemplate(child)) {
        let result = (flatwrap(evaluate(child, stack, cache)) as Array<string | VirtualElement | RealTarget | number>)
        switch ((child as Template).type) {
          case 'if': case 'for': case 'group':
            result.push(i - index)
        }
        return result
      } else {
        return [child] as Array<string | VirtualElement | RealTarget | number>
      }
    })
    .reduce((ary, values) => { // flatMap
      ary.push(...values)
      return ary
    }, [])
  if (typeof result[result.length - 1] === 'number') {
    result.pop()
  }
  return result
}

export function evaluateAttrs(
  template: HasAttrTemplate,
  stack: StateStack,
  cache: Cache,
  ve: VirtualElement | RealTarget
): void
{
  if (template.style) {
    ve.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack, cache) as string
  }

  if (template.bools) {
    for (let key in template.bools) {
      if (!key.startsWith('@')) { // Remove syntax attributes
        let value = template.bools[key]
        let result = typeof value === 'string' ? value : evaluate(value as Template, stack, cache)
        if (result) {
          if (!ve.attrs) {
            ve.attrs = {}
          }
          ve.attrs[key] = result
        }
      }
    }
  }

  if (template.attrs) {
    for (let key in template.attrs) {
      if (!key.startsWith('@')) { // Remove syntax attributes
        let value = template.attrs[key]
        if (!ve.attrs) {
          ve.attrs = {}
        }
        (ve.attrs as Record<string, unknown>)[key] = typeof value === 'string' ? value : evaluate(value as Template, stack, cache)
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
    for (let type in template.on) {
      ve.on[type] = template.on[type].map(listener => evaluate(listener, stack, cache) as EventListener)
    }
  }
}

function compareCache(
  cache: StateStack,
  stack: StateStack,
  cacheIndex: number = cache.length - 1,
  stackIndex: number = stack.length - 1
): boolean
{
  let [cacheLoop, newCacheIndex] = pickupIndex(cache, 'loop', cacheIndex) as [Loop | undefined, number]
  let [stackLoop, newStackIndex] = pickupIndex(stack, 'loop', stackIndex) as [Loop | undefined, number]

  if (!cacheLoop && !stackLoop) return true
  if (!cacheLoop || !stackLoop) return false

  return cacheLoop.index === stackLoop.index &&
    cacheLoop.key === stackLoop.key &&
    cacheLoop.value === stackLoop.value &&
    compareCache(cache, stack, newCacheIndex - 1,  newStackIndex - 1)
}

function flatwrap(value: unknown): Array<unknown>
{
  return value === null || value === undefined ?
    [] :
    Array.isArray(value) ? value : [value]
}

// deno-lint-ignore no-explicit-any
export function operateUnary(operator: string, operand: any)
{
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
function continueEvaluation(operator: string, left: any): boolean
{
  switch (operator) {
    case '&&': return !!left
    case '||': return !left
    case '??': return left === null || left === undefined
    default: return true
  }
}

// deno-lint-ignore no-explicit-any
export function operateBinary(operator: string, left: any, right: any)
{
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
    case '??': return (left !== null && left !== undefined) ? left : right

    // Other operators
    default: throw Error(operator + ' does not exist')
  }
}