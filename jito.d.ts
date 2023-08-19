// Data Binding

export type RecursiveCallback = () => void
export type TargetCallback = ((newValue: any, oldValue: any) => void)
export type Callback = RecursiveCallback | TargetCallback

export function watch<T>(data: T): T
export function watch<T>(data: T, callback: RecursiveCallback, isExecute?: boolean): T
export function watch<T>(data: T, key: string, callback: TargetCallback, isExecute?: boolean): T

export function receive(data: unknown, ...keys: string[]): Promise<Record<string, unknown>>
export function receive(data: unknown, keys: string[]): Promise<Record<string, unknown>>
export function receive(data: unknown, ...keys: string[] | string[][]): Promise<Record<string, unknown>>

export function unwatch<T>(data: T): T
export function unwatch<T>(data: T, callback: RecursiveCallback): T
export function unwatch<T>(data: T, key: string, callback: TargetCallback): T

export function reach(data: unknown, callback: RecursiveCallback): unknown

export function unreach(data: unknown, callback: RecursiveCallback): unknown

export function change(data: unknown, key: string, value: unknown): unknown

export function lock<T>(obj: T): T

export function unlock<T>(obj: T): T

export interface HasAttrs {
  class?: Array<string>
  part?: Array<string>
  style?: string
  attrs?: Record<string, unknown>
  on?: Record<string, Array<EventListener>>
}

export type VirtualNode = string | VirtualElement | RealTarget | number

export interface VirtualTree {
  children?: Array<VirtualNode>
}

export interface VirtualElement extends VirtualTree, HasAttrs {
  tag: string
  is?: string
  key?: unknown
  new?: boolean
}

export interface RealTarget extends VirtualTree, HasAttrs {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  invalid?: {
    attrs?: boolean
    on?: boolean
    children?: boolean
  }
}

export interface RealElement extends RealTarget {
  el: Element
}

export interface Linked {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
}

export type LinkedVirtualNode = string | LinkedVirtualElement | LinkedRealTarget | number

export interface LinkedVirtualRoot extends Linked {
  children?: Array<LinkedVirtualNode>
}

export interface LinkedVirtualTree extends  LinkedVirtualRoot {
  el: Element | DocumentFragment | ShadowRoot
}

export interface LinkedVirtualElement extends LinkedVirtualRoot, HasAttrs {
  el: Element
  tag: string
  is?: string
  key?: unknown
}

export interface LinkedRealTarget extends LinkedVirtualRoot, HasAttrs {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  invalid?: {
    attrs?: boolean
    on?: boolean
    children?: boolean
  }
}

export interface LinkedRealElement extends LinkedRealTarget {
  el: Element
}

export let eventTypes: { destroy: string, patch: string }

export function load(el: Element | DocumentFragment): LinkedVirtualTree

export function patch(
  tree: LinkedVirtualTree,
  newTree: VirtualTree,
  useEvent?: boolean
) : LinkedVirtualTree

export function destroy(tree: LinkedVirtualRoot, useEvent?: boolean): void

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
  key: PropertyKey
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

export type Restack = (stack: StateStack) => StateStack

export interface Snippet {
  template: Template,
  restack: Restack
}

export class Loop
{
  get key(): unknown
  get value(): unknown
  get index(): number
  get size(): number
  get isFirst(): boolean
  get isLast(): boolean
  get parent(): Loop | undefined
}

export function parse(html: string): TreeTemplate

export function expression(script: string): Template

export function evaluate (
  template: Template | CustomTemplate,
  stack?: StateStack
): unknown

export function render(tree: VirtualTree): string

export function pickup(
  stack: StateStack,
  name: string
): unknown

export function assign(
  stack: StateStack,
  name: string,
  value: unknown
): void

export function snip(
  template: Template | string,
  restack?: Restack
): Snippet

// Web Components

export interface Component {
  patcher?: Patcher
  template?: TreeTemplate
  main: Main | StateStack
  options: {
    mode: ShadowRootMode
    delegatesFocus?: boolean
    localeOnly?: boolean
  }
}

  // Initialize function
export type Main = (entity: Entity) => StateStack | Record<string, unknown> | void | Promise<StateStack | Record<string, unknown> | void>

export interface ComponentOptions {
  mode?: ShadowRootMode
  delegatesFocus?: boolean
  localeOnly?: boolean
}

export type Patcher = (stack: StateStack) => VirtualTree

export interface ComponentTemplate extends CustomElementTemplate {
  isForce?: boolean
  cache?: string | Component | unknown
}
export type Module = {
  [Symbol.toStringTag]: 'Module'
  default?: unknown
  [attr: string]: unknown
}

export type TakeOptions = {
  [key: string]: boolean | {
    default?: unknown
  }
}

export let builtin: Record<string, unknown>

export class Entity
{
  public constructor(component: Component, host: Element, tree: LinkedVirtualTree)

  public setAttr(name: string, value: unknown): void
  public get component(): Component
  public get host(): Element
  public get root(): ShadowRoot
  public get attrs(): Record<string, unknown>
  public get ready(): () => Promise<void>
  public patch(template?: string | TreeTemplate | Patcher): void
  public dispatch(typeArg: string, detail?: unknown): void
  public watch<T>(data: T): T
  public watch<T>(data: T, callback: RecursiveCallback, isExecute?: boolean): T
  public watch<T>(data: T, key: string, callback: TargetCallback, isExecute?: boolean): T
  public take<T>(options: TakeOptions): Promise<T>
}

export class ComponentElement extends HTMLElement
{
  setAttr(name: string, value: unknown): void
  static getComponent(): Component | undefined
  loadAttrs(): void
  ready(): Promise<void>
  get entity(): Entity | undefined
}

export function elementize(component: Component): Promise<Element>
export function elementize(component: Component, attrs: Record<string, unknown>): Promise<Element>
export function elementize(component: Promise<Component>): Promise<Element>
export function elementize(component: Promise<Component>, attrs: Record<string, unknown>): Promise<Element>
export function elementize(module: Module): Promise<Element>
export function elementize(module: Module, attrs: Record<string, unknown>): Promise<Element>
export function elementize(module: Promise<Module>): Promise<Element>
export function elementize(module: Promise<Module>, attrs: Record<string, unknown>): Promise<Element>
export function elementize(tag: string): Promise<Element>
export function elementize(tag: string, attrs: Record<string, unknown>): Promise<Element>
export function elementize(component: Component | Promise<Component> | Module | Promise<Module> | string, attrs?: Record<string, unknown>): Promise<Element>

export function compact(html: string): Component
export function compact(html: string, stack: StateStack): Component
export function compact(html: string, state: Record<string, unknown>): Component
export function compact(html: string, main: Main): Component
export function compact(template: TreeTemplate): Component
export function compact(template: TreeTemplate, stack: StateStack): Component
export function compact(template: TreeTemplate, state: Record<string, unknown>): Component
export function compact(template: TreeTemplate, main: Main): Component
export function compact(patcher: Patcher): Component
export function compact(patcher: Patcher, stack: StateStack): Component
export function compact(patcher: Patcher, state: Record<string, unknown>): Component
export function compact(patcher: Patcher, main: Main): Component
export function compact(template: string | TreeTemplate | Patcher, main: StateStack | Record<string, unknown> | Main): Component

export function define(name: string, component: Component): void
export function define(name: string, html: string): void
export function define(name: string, html: string, stack: StateStack): void
export function define(name: string, html: string, state: Record<string, unknown>): void
export function define(name: string, html: string, main: Main): void
export function define(name: string, template: TreeTemplate): void
export function define(name: string, template: TreeTemplate, stack: StateStack): void
export function define(name: string, template: TreeTemplate, state: Record<string, unknown>): void
export function define(name: string, template: TreeTemplate, main: Main): void
export function define(name: string, patcher: Patcher): void
export function define(name: string, patcher: Patcher, stack: StateStack): void
export function define(name: string, patcher: Patcher, state: Record<string, unknown>): void
export function define(name: string, patcher: Patcher, main: Main): void
export function define(name: string, template: string | TreeTemplate | Patcher | Component, main: StateStack | Record<string, unknown> | Main): void

export function mount(selectors: string, component: Component): void
export function mount(selectors: string, html: string): void
export function mount(selectors: string, html: string, stack: StateStack): void
export function mount(selectors: string, html: string, state: Record<string, unknown>): void
export function mount(selectors: string, html: string, main: Main): void
export function mount(selectors: string, template: TreeTemplate): void
export function mount(selectors: string, template: TreeTemplate, stack: StateStack): void
export function mount(selectors: string, template: TreeTemplate, state: Record<string, unknown>): void
export function mount(selectors: string, template: TreeTemplate, main: Main): void
export function mount(selectors: string, patcher: Patcher): void
export function mount(selectors: string, patcher: Patcher, stack: StateStack): void
export function mount(selectors: string, patcher: Patcher, state: Record<string, unknown>): void
export function mount(selectors: string, patcher: Patcher, main: Main): void
export function mount(element: Element, component: Component): void
export function mount(element: Element, html: string): void
export function mount(element: Element, html: string, stack: StateStack): void
export function mount(element: Element, html: string, state: Record<string, unknown>): void
export function mount(element: Element, html: string, main: Main): void
export function mount(element: Element, template: TreeTemplate): void
export function mount(element: Element, template: TreeTemplate, stack: StateStack): void
export function mount(element: Element, template: TreeTemplate, state: Record<string, unknown>): void
export function mount(element: Element, template: TreeTemplate, main: Main): void
export function mount(element: Element, patcher: Patcher): void
export function mount(element: Element, patcher: Patcher, stack: StateStack): void
export function mount(element: Element, patcher: Patcher, state: Record<string, unknown>): void
export function mount(element: Element, patcher: Patcher, main: Main): void
export function mount(target: string | Element, template: string | TreeTemplate | Patcher | Component, main: StateStack | Record<string, unknown> | Main): void

export function seal(
  component: Component,
  options?: ComponentOptions
): Component
