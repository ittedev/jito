// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export const isRef = Symbol('Beako-ref')

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
  'element' |
  'tree' |
  'group' |
  'handler' |
  'get'

export interface Template {
  type: string
}

export interface CoreTemplate {
  type: TemplateType
}

// deno-lint-ignore no-explicit-any
export function instanceOfTemplate(object: any): object is CoreTemplate {
  return typeof object === 'object' &&  typeof object.type === 'string'
}

export interface LiteralTemplate extends CoreTemplate {
  type: 'literal'
  value: unknown
}

export interface ArrayTemplate extends CoreTemplate {
  type: 'array'
  values: Array<Template>
}

export interface ObjectTemplate extends CoreTemplate {
  type: 'object'
  entries: Array<[Template, Template]>
}

export interface VariableTemplate extends CoreTemplate {
  type: 'variable'
  name: string
}

export interface UnaryTemplate extends CoreTemplate {
  type: 'unary'
  operator: string
  operand: Template
}

export interface BinaryTemplate extends CoreTemplate {
  type: 'binary'
  operator: string
  left: Template
  right: Template
}

export interface AssignTemplate extends CoreTemplate {
  type: 'assign'
  operator: string
  left: VariableTemplate | HashTemplate
  right: Template
}

export interface FunctionTemplate extends CoreTemplate {
  type: 'function'
  name: Template
  params: Array<Template>
}

export interface HashTemplate extends CoreTemplate {
  type: 'hash'
  object: Template
  key: Template
}

export interface GetTemplate extends CoreTemplate {
  type: 'get'
  value: Template
}

export interface JoinTemplate extends CoreTemplate {
  type: 'join'
  values: Array<unknown | Template>
  separator: string
}

export interface FlagsTemplate extends CoreTemplate {
  type: 'flags'
  value: Template
}

export interface IfTemplate extends CoreTemplate {
  type: 'if'
  condition: Template
  truthy: Template
  falsy?: Template | undefined
}

export interface ForTemplate extends CoreTemplate {
  type: 'for'
  array: Template
  value: Template
  each?: string
}

export interface HasChildrenTemplate {
  type: string
  children?: Array<Template | string>
}

export interface TreeTemplate extends HasChildrenTemplate {
  type: 'tree' | 'element'
}

export interface HasAttrTemplate extends Template {
  type: string
  props?: Record<string, unknown | Template>
}

export interface ElementTemplate extends TreeTemplate, HasAttrTemplate {
  type: 'element'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  props?: Record<string, unknown | Template>
  bools?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  children?: Array<Template | string>
  on?: Record<string, Array<HandlerTemplate>>
}

export interface GroupTemplate extends HasChildrenTemplate, HasAttrTemplate {
  type: 'group'
  props?: Record<string, unknown | Template>
  children?: Array<Template | string>
}

export interface HandlerTemplate {
  type: 'handler'
  value: Template
}

export interface Cache {
  handler?: WeakMap<HandlerTemplate, Array<[Variables, EventListener]>>
  groups?: [WeakMap<Template, number>, number]
}

export type Ref = {
  record: Record<PropertyKey, unknown>,
  key: PropertyKey,
  [isRef]: boolean
}

// deno-lint-ignore no-explicit-any
export function instanceOfRef(object: any): object is Ref {
  return typeof object === 'object' && object[isRef] === true
}

export type Evaluate = (template: Template, stack: Variables, cache: Cache) => unknown

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
