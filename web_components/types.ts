// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Variables, TemplateType, Template, TreeTemplate, HasAttrTemplate } from '../template_engine/types.ts'
import { Entity } from './entity.ts'
export type ExtendedTemplateType = TemplateType | 'evaluation' | 'lazy'

export interface EvaluationTemplate extends Template {
  type: 'evaluation'
  template: Template
  stack?: Variables
}

export interface CustomElementTemplate extends HasAttrTemplate {
  type: 'custom' | 'element'
  tag: string
  is?: string | Template
  class?: Array<Array<string> | Template>
  part?: Array<Array<string> | Template>
  props?: Record<string, unknown | Template>
  style?: string | Template
  children?: Array<Template | string>
  isForce?: boolean // Evaluate as an component without verifying whether it is a component
}

// TODO: get refs
// TODO: get lifecycle
export type ComponentConstructor = (entity: Entity) => Variables | Record<string, unknown> | void | Promise<Variables | Record<string, unknown> | void>

export interface Component {
  template: TreeTemplate
  stack: ComponentConstructor | Variables
}

// deno-lint-ignore no-explicit-any
export function instanceOfComponent(object: any): object is Component {
  return typeof object === 'object' && object.template && object.stack
}
