// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
// deno-lint-ignore-file no-fallthrough
import {
  Template,
  instanceOfTemplate,
  TreeTemplate,
  ElementTemplate,
  IfTemplate,
  ForTemplate,
} from '../template_engine/types.ts'
import { isPrimitive } from './is_primitive.ts'

export function extend(template: Template): Template
export function extend(template: unknown): unknown
export function extend(template: unknown | Template): unknown | Template {
  if (instanceOfTemplate(template)) {
    switch (template.type) {
      case 'element':
        if (!isPrimitive(template as ElementTemplate) || 'is' in (template as ElementTemplate)) {
          template.type = 'custom'
        }
      case 'tree':
        (template as TreeTemplate).children?.forEach(extend)
        break
      case 'if': {
        extend((template as IfTemplate).truthy)
        extend((template as IfTemplate).falsy)
        break
      }
      case 'for': {
        extend((template as ForTemplate).value)
        break
      }
    }
  }
  return template
}
