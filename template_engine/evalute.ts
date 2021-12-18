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
  Evalute,
  Evaluator
} from './types.ts'
import { operateUnary, operateBinary } from './operate.ts'

export function evalute(template: Template, stack: Variables): unknown {
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
    (template: LiteralTemplate, stack: Variables): unknown => template.value
  ) as Evalute,

  variable: ((template: VariableTemplate, stack: Variables): unknown => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (template.name in stack[i]) return stack[i][template.name]
    }
    throw Error(template.name + ' is not defined')
  }) as Evalute,

  unary: (
    (template: UnaryTemplate, stack: Variables): unknown =>
      operateUnary(template.operator, evalute(template.operand, stack))
  ) as Evalute,

  binary: (
    (template: BinaryTemplate, stack: Variables): unknown =>
      operateBinary(template.operator, evalute(template.left, stack), evalute(template.right, stack))
  ) as Evalute,

  ['function']: (
    (template: FunctionTemplate, stack: Variables): unknown => {
      const func = evalute(template.name, stack)
      if (typeof func === 'function') {
        return func(...template.params.map(param => evalute(param, stack)))
      }
      throw Error(template.name.toString() + ' is not a function')
    }
  ) as Evalute,

  hash: (
    (template: HashTemplate, stack: Variables): unknown =>
      (evalute(template.object, stack) as Record<PropertyKey, unknown>)[evalute(template.key, stack) as PropertyKey]
  ) as Evalute,

  join: (
    (template: JoinTemplate, stack: Variables): string => {
      return template.values.reduce<string>((result: string, value: unknown | Template) => {
        if (instanceOfTemplate(value)) {
          const text = evalute(value, stack)
          return result + (typeof text === 'object' ? JSON.stringify(text) : text as string)
        } else {
          return result + value
        }
      }, '')
    }
  ) as Evalute,

  flags: (
    (template: FlagsTemplate, stack: Variables): Array<string> =>
      toFlags(evalute(template.value, stack))
  ) as Evalute,

  ['if']: (
    (template: IfTemplate, stack: Variables): unknown =>
      evalute(template.condition, stack) ? evalute(template.truthy, stack) : template.falsy ? evalute(template.falsy, stack) : null
  ) as Evalute,

  each: (
    (template: EachTemplate, stack: Variables): unknown => {
      const array = evalute(template.array, stack)
      return ''
    }
  ) as Evalute,

  element: (
    (template: ElementTemplate, stack: Variables): VirtualElement => {
      // TODO
      const tree = { tag: template.el.tag } as VirtualElement
      if (template.el.style) {
        tree.style = typeof template.el.style === 'string' ? template.el.style : evalute(template.el.style, stack) as string
      }
      return tree
    }
  ) as Evalute

} as Evaluator
