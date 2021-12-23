// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { TemplateType, Template } from '../template_engine/types.ts'

export type ExpandedTemplateType = TemplateType | 'component'

export interface ComponentTemplate extends Template {
  type: 'element'
  tag: string,
  class: Array<Array<string> | Template>,
  part: Array<Array<string> | Template>,
  attr: Record<string, unknown | Template>,
  style: string | Template
  children: Array<Template | string>
}

export interface Component extends CustomElementConstructor, HTMLElement {
  rawAttributes: Record<string, unknown> | null
}
