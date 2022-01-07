// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export type Variables = Array<Record<string, unknown>>

export type TemplateType =
  'literal' |
  'array' |
  'object' |
  'variable' |
  'unary' |
  'binary' |
  'assign' |
  'function' |
  'hash' |
  'join' |
  'flags' |
  'if' |
  'for' |
  'expand' |
  'element' |
  'tree' |
  'group'

export interface Template {
  type: string
}

// deno-lint-ignore no-explicit-any
export function instanceOfTemplate(object: any): object is Template {
  return typeof object === 'object' && 'type' in object
}

export interface LiteralTemplate extends Template {
  type: 'literal'
  value: unknown
}

export interface ArrayTemplate extends Template {
  type: 'array'
  values: Array<Template>
}

export interface ObjectTemplate extends Template {
  type: 'object'
  entries: Array<[Template, Template]>
}

export interface VariableTemplate extends Template {
  type: 'variable'
  name: string
}

export interface UnaryTemplate extends Template {
  type: 'unary'
  operator: string
  operand: Template
}

export interface BinaryTemplate extends Template {
  type: 'binary'
  operator: string
  left: Template
  right: Template
}

export interface AssignTemplate extends Template {
  type: 'assign'
  operator: string
  left: VariableTemplate | HashTemplate
  right: Template
}

export interface FunctionTemplate extends Template {
  type: 'function'
  name: Template
  params: Array<Template>
}

export interface HashTemplate extends Template {
  type: 'hash'
  object: Template
  key: Template
}

export interface GetTemplate extends Template {
  type: 'get'
  value: Template
}

export interface JoinTemplate extends Template {
  type: 'join'
  values: Array<unknown | Template>
  separator: string
}

export interface FlagsTemplate extends Template {
  type: 'flags'
  value: Template
}

export interface IfTemplate extends Template {
  type: 'if'
  condition: Template
  truthy: Template
  falsy?: Template | undefined
}

export interface ForTemplate extends Template {
  type: 'for'
  array: Template
  value: Template
  each?: string
}

export interface TreeTemplate extends Template {
  type: 'tree' | 'element'
  children?: Array<Template | string>
}

export interface HasAttrTemplate extends Template {
  props?: Record<string, unknown | Template>
}

export interface ElementTemplate extends TreeTemplate, HasAttrTemplate {
  type: 'element'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  props?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  children?: Array<Template | string>
  on?: Record<string, Array<Template>>
}

export interface ExpandTemplate extends Template {
  type: 'expand'
  template: Template
  default: Template
}

export interface GroupTemplate extends HasAttrTemplate {
  type: 'group'
  props?: Record<string, unknown | Template>
  children?: Array<Template | string>
}

export interface ListenerTemplate {
  type: 'listener'
  value: Template
}
export interface CachedListenerTemplate extends ListenerTemplate {
  cache: Array<[Variables, EventListener]>
}

export type Ref = [Record<PropertyKey, unknown>, PropertyKey]

export type Evaluate = (template: Template, stack: Variables) => unknown

export type Evaluator = Record<string, Evaluate>

export type TokenField =
  'text' |
  'script' |
  'singleString' |
  'doubleString' |
  'template' |
  'lineComment' |
  'blockComment'

export type TokenType = 
  '' |
  'multi' |
  'unary' |
  'binary' |
  'assign' |
  'crement' | // ++' | --
  '.' |
  '?.' |
  '[' |
  ']' |
  '(' |
  ')' |
  '{' |
  '}' |
  '{{' |
  '}}' |
  '${' |
  '}' |
  'lineComment' |     // //~
  'leftComment' |  // /*
  'rightComment' |  // */
  ',' |
  '!' |
  '?' |
  ':' |
  "'" |
  '"' |
  '`' |
  '...' |
  'return' |
  'null' |
  'undefined' |
  'boolean' |     // false' | true
  'kwyword' |
  'number' |      // 0' | 1' | 2' | etc.' |
  'string' |      // "~"' | '~'
  'word' |        // x
  'escape' |
  'partial' |
  'other'


export type Token = [TokenType, string]
