// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export const isRef = Symbol.for('Beako Ref')

export type Variables = Array<Record<string, unknown>>

export type Template =
  LiteralTemplate |
  ArrayTemplate |
  ObjectTemplate |
  VariableTemplate |
  UnaryTemplate |
  BinaryTemplate |
  AssignTemplate |
  FunctionTemplate |
  HashTemplate |
  JoinTemplate |
  FlagsTemplate |
  IfTemplate |
  ForTemplate |
  ElementTemplate |
  CustomElementTemplate |
  TreeTemplate |
  GroupTemplate |
  HandlerTemplate |
  GetTemplate |
  FlatTemplate |
  DrawTemplate |
  EvaluationTemplate

export type HasChildrenTemplate =
  TreeTemplate |
  ElementTemplate |
  CustomElementTemplate |
  GroupTemplate

export type HasAttrTemplate =
  GroupTemplate |
  ElementTemplate |
  CustomElementTemplate

// deno-lint-ignore no-explicit-any
export function instanceOfTemplate(object: any): object is Template {
  return typeof object === 'object' &&
    object !== null &&
    typeof object.type === 'string'
}

export interface LiteralTemplate {
  type: 'literal'
  value: unknown
}

export interface ArrayTemplate {
  type: 'array'
  values: Array<Template>
}

export interface FlatTemplate {
  type: 'flat'
  values: Array<Template | string>
}

export interface ObjectTemplate {
  type: 'object'
  entries: Array<[Template, Template]>
}

export interface VariableTemplate {
  type: 'variable'
  name: string
}

export interface UnaryTemplate {
  type: 'unary'
  operator: string
  operand: Template
}

export interface BinaryTemplate {
  type: 'binary'
  operator: string
  left: Template
  right: Template
}

export interface AssignTemplate {
  type: 'assign'
  operator: string
  left: VariableTemplate | HashTemplate
  right: Template
}

export interface FunctionTemplate {
  type: 'function'
  name: Template
  params: Array<Template>
}

export interface HashTemplate {
  type: 'hash'
  object: Template
  key: Template
}

export interface GetTemplate {
  type: 'get'
  value: Template
}

export interface DrawTemplate {
  type: 'draw'
  value: Template
}

export interface JoinTemplate {
  type: 'join'
  values: Array<unknown | Template>
  separator: string
}

export interface FlagsTemplate {
  type: 'flags'
  value: Template
}

export interface IfTemplate {
  type: 'if'
  condition: Template
  truthy: Template
  falsy?: Template | undefined
}

export interface ForTemplate {
  type: 'for'
  array: Template
  value: Template
  each?: string
}

export interface TreeTemplate {
  type: 'tree'
  children?: Array<Template | string>
}

export interface ElementTemplate {
  type: 'element'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  props?: Record<string, unknown | Template>
  bools?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  on?: Record<string, Array<HandlerTemplate>>
  children?: Array<Template | string>
}

export interface CustomElementTemplate {
  type: 'custom'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  props?: Record<string, unknown | Template>
  bools?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  on?: Record<string, Array<HandlerTemplate>>
  children?: Array<Template | string>
}

export interface GroupTemplate {
  type: 'group'
  class: undefined
  part: undefined
  props?: Record<string, unknown | Template>
  bools: undefined
  style: undefined
  on: undefined
  children?: Array<Template | string>
}

export interface EvaluationTemplate {
  type: 'evaluation'
  template: Template
  stack?: Variables
}

export interface HandlerTemplate {
  type: 'handler'
  value: Template
}

export interface CustomTemplate {
  type: string
  [key: string]: unknown
}

export interface Cache {
  handler?: WeakMap<HandlerTemplate, Array<[Variables, EventListener]>>
  groups?: [WeakMap<HasChildrenTemplate, number>, number]
}

export type Ref = {
  record: Record<PropertyKey, unknown>,
  key: PropertyKey,
  [isRef]: boolean
}

// deno-lint-ignore no-explicit-any
export function instanceOfRef(object: any): object is Ref {
  return typeof object === 'object' &&
    object !== null &&
    object[isRef] === true
}

export interface Plugin {
  // deno-lint-ignore no-explicit-any
  match: (...arg: Array<any>) => boolean,
  // deno-lint-ignore no-explicit-any
  exec: (...arg: Array<any>) => unknown
}

export interface Pluginable<T extends Plugin> extends Function {
  plugin(plugin: T): void
}

export interface EvaluatePlugin extends Plugin {
  match: (template: CustomElementTemplate | CustomTemplate, stack: Variables, cache: Cache) => boolean,
  exec: (template: CustomElementTemplate | CustomTemplate, stack: Variables, cache: Cache) => unknown
}

export interface Evaluate extends Pluginable<EvaluatePlugin> {
  (template: Template | CustomTemplate, stack?: Variables, cache?: Cache): unknown
  plugin(plugin: EvaluatePlugin): void
}

export type TokenField =
  'html' |
  'text' |
  'script' |
  'single' |
  'double' |
  'template' |
  'comment' |
  'lineComment' |
  'attr' |
  'blockComment'
  // TODO: comment

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
  '<!--' |
  '-->' |
  '>' |
  '//' |
  '/*' |
  '*/' |
  ',' |
  '!' |
  '?' |
  ':' |
  "'" |
  '"' |
  '`' |
  '/' |
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
  'start' |
  'end' |
  'name' |
  'on' |
  '@' |
  'other'


export type Token = [TokenType, string]

export interface TemporaryNode {
  next?: TemporaryNode
}

export interface TemporaryText extends TemporaryNode {
  text: string
}

export interface TemporaryElement extends TemporaryNode {
  tag: string
  attrs: Array<[string, string, string]>
  child?: TemporaryNode
}

export function instanceOfTemporaryElement(node: TemporaryNode): node is TemporaryElement {
  return 'tag' in node
}
