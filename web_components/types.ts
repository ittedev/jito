// deno-lint-ignore-file no-explicit-any
import type { VirtualTree } from '../virtual_dom/types.ts'
import type {
  StateStack,
  TreeTemplate,
  CustomElementTemplate,
  Cache
} from '../template_engine/types.ts'
import { Entity } from './entity.ts'

export const special = Symbol.for('Jito Special')

export type Patcher = (stack: StateStack) => VirtualTree

export interface ComponentTemplate extends CustomElementTemplate {
  isForce?: boolean // Evaluate as an component without verifying whether it is a component
  cache?: string | Component | unknown
}

export type Main = (entity: Entity) => StateStack | Record<string, unknown> | void | Promise<StateStack | Record<string, unknown> | void>

export interface ComponentOptions {
  mode?: ShadowRootMode
  delegatesFocus?: boolean
  localeOnly?: boolean
}

/**
 * @alpha
 */
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

export function instanceOfComponent(object: any): object is Component {
  return typeof object === 'object' &&
    object !== null &&
    (object.template || object.patcher) &&
    object.main &&
    object.options
}

export interface SpecialCache extends Cache {
  [special]: Array<Element | DocumentFragment | ShadowRoot | EventTarget>
}

export type Module = {
  [Symbol.toStringTag]: 'Module'
  default?: unknown
  [attr: string]: unknown
}

export function instanceOfModule(object: any): object is Module {
  return  typeof object === 'object' &&
    object !== null &&
    'default' in object &&
    (object as Module)[Symbol.toStringTag] === 'Module'
}

export type TakeOptions = {
  [key: string]: boolean | {
    default?: unknown
  }
}
