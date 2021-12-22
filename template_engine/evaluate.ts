// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { VirtualElement } from '../virtual_dom/types.ts'
import {
  Variables,
  Template,
  instanceOfTemplate,
  LiteralTemplate,
  VariableTemplate,
  UnaryTemplate,
  BinaryTemplate,
  FunctionTemplate,
  HashTemplate,
  JoinTemplate,
  FlagsTemplate,
  IfTemplate,
  EachTemplate,
  ElementTemplate,
  TreeTemplate,
  Evaluate,
  Evaluator
} from './types.ts'
import { operateUnary, operateBinary } from './operate.ts'

export function evaluate(template: Template, stack: Variables): unknown {
  return evaluator[template.type](template, stack)
}

function toFlags(value: unknown) {
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

export const evaluator = {

  literal: (
    (template: LiteralTemplate, _stack: Variables): unknown => template.value
  ) as Evaluate,

  variable: ((template: VariableTemplate, stack: Variables): unknown => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (template.name in stack[i]) return stack[i][template.name]
    }
    throw Error(template.name + ' is not defined')
  }) as Evaluate,

  unary: (
    (template: UnaryTemplate, stack: Variables): unknown =>
      operateUnary(template.operator, evaluate(template.operand, stack))
  ) as Evaluate,

  binary: (
    (template: BinaryTemplate, stack: Variables): unknown =>
      operateBinary(template.operator, evaluate(template.left, stack), evaluate(template.right, stack))
  ) as Evaluate,

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
    (template: HashTemplate, stack: Variables): unknown =>
      (evaluate(template.object, stack) as Record<PropertyKey, unknown>)[evaluate(template.key, stack) as PropertyKey]
  ) as Evaluate,

  join: (
    (template: JoinTemplate, stack: Variables): string => {
      return template.values.reduce<string>((result: string, value: unknown | Template) => {
        if (instanceOfTemplate(value)) {
          const text = evaluate(value, stack)
          return result + (typeof text === 'object' ? JSON.stringify(text) : text as string)
        } else {
          return result + value
        }
      }, '')
    }
  ) as Evaluate,

  flags: (
    (template: FlagsTemplate, stack: Variables): Array<string> =>
      toFlags(evaluate(template.value, stack))
  ) as Evaluate,

  ['if']: (
    (template: IfTemplate, stack: Variables): unknown =>
      evaluate(template.condition, stack) ? evaluate(template.truthy, stack) : template.falsy ? evaluate(template.falsy, stack) : null
  ) as Evaluate,

  each: (
    (template: EachTemplate, stack: Variables): unknown => {
      const array = evaluate(template.array, stack)
      return ''
    }
  ) as Evaluate,

  element: (
    (template: ElementTemplate, stack: Variables): VirtualElement => {
      // TODO
      const tree = { tag: template.tag } as VirtualElement
      if (template.style) {
        tree.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack) as string
      }
      return tree
    }
  ) as Evaluate,
  
  tree: (
    (_template: TreeTemplate, _stack: Variables): VirtualElement => {
      return ''
    }
  ) as Evaluate

} as Evaluator