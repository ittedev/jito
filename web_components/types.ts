// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Variables, TemplateType, Template, HasAttrTemplate } from '../template_engine/types.ts'

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
  attr?: Record<string, unknown | Template>
  style?: string | Template
  children?: Array<Template | string>
}

// TODO: get refs
// TODO: get lifecycle
export type Construct = (attr?: Record<string, unknown | Template>) => Variables | Record<string, unknown> | void | Promise<Variables | Record<string, unknown> | void>

