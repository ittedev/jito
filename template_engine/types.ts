export const isRef = Symbol.for('Jito Ref')

export type StateStack = Array<Record<string, unknown>>

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
  TryTemplate |
  IfTemplate |
  ForTemplate |
  BindTemplate |
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
  prevalue?: boolean
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

export interface TryTemplate {
  type: 'try'
  value: Template
  failure?: Template
}

export interface IfTemplate {
  type: 'if'
  condition: Template
  truthy: Template
  falsy?: Template | undefined
  isTryed: boolean
}

export interface ForTemplate {
  type: 'for'
  array: Template
  value: Template
  each?: string
  isTryed: boolean
}

export interface BindTemplate {
  type: 'bind'
  name: string
  to?: Template
  value: Template
}

export interface TreeTemplate {
  type: 'tree'
  children?: Array<Template | string>
}

/**
 * @alpha
 */
export interface ElementTemplate {
  type: 'element'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  attrs?: Record<string, unknown | Template>
  bools?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  on?: Record<string, Array<HandlerTemplate>>
  chunks?: Array<Template>
  children?: Array<Template | string>
}

/**
 * @alpha
 */
export interface CustomElementTemplate {
  type: 'custom'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | FlagsTemplate>
  part?: Array<Array<string> | FlagsTemplate>
  attrs?: Record<string, unknown | Template>
  bools?: Record<string, unknown | Template>
  style?: string | JoinTemplate
  on?: Record<string, Array<HandlerTemplate>>
  chunks?: Array<Template>
  children?: Array<Template | string>
}

export interface GroupTemplate {
  type: 'group'
  class: undefined
  part: undefined
  attrs?: Record<string, unknown | Template>
  bools: undefined
  style: undefined
  on: undefined
  chunks: undefined
  children?: Array<Template | string>
}

export interface EvaluationTemplate {
  type: 'evaluation'
  value: Template
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
  handler?: WeakMap<HandlerTemplate, Array<[StateStack, EventListener]>>
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
  match: (template: CustomElementTemplate | CustomTemplate, stack: StateStack, cache: Cache) => boolean,
  exec: (template: CustomElementTemplate | CustomTemplate, stack: StateStack, cache: Cache) => unknown
}

export interface Evaluate extends Pluginable<EvaluatePlugin> {
  (template: Template | CustomTemplate, stack?: StateStack, cache?: Cache): unknown
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
  'attr' |
  'plane'

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
  '{|' |
  '|}' |
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
  'entity' |
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
