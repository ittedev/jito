// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import type {
  Variables,
  TreeTemplate,
  CustomElementTemplate,
  Cache
} from '../template_engine/types.ts'
import { Entity } from './entity.ts'

export const special = Symbol.for('Beako Special')

export type Patcher = (stack: Variables) => VirtualTree

export interface ComponentTemplate extends CustomElementTemplate {
  isForce?: boolean // Evaluate as an component without verifying whether it is a component
  cache?: string | Component | unknown
}

export type Main = (entity: Entity) => Variables | Record<string, unknown> | void | Promise<Variables | Record<string, unknown> | void>

export interface ComponentOptions {
  mode?: ShadowRootMode
  delegatesFocus?: boolean
  localeOnly?: boolean
}

export interface Component {
  patcher?: Patcher
  template?: TreeTemplate
  data: Main | Variables
  options: {
    mode: ShadowRootMode
    delegatesFocus?: boolean
    localeOnly?: boolean
  }
}

// deno-lint-ignore no-explicit-any
export function instanceOfComponent(object: any): object is Component {
  return typeof object === 'object' &&
    object !== null &&
    (object.template || object.patcher) &&
    object.data &&
    object.options
}

export interface SpecialCache extends Cache {
  [special]: Array<Element | DocumentFragment | ShadowRoot | EventTarget>
}
