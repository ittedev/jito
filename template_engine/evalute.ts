// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { VirtualElement } from '../virtual_dom/types.ts'
import { Template, Variables } from './types.ts'
import { ElementTemplate } from './template/mod.ts'

export function evalute(template: ElementTemplate, data: Variables | Record<string, unknown>): VirtualElement {
  const stack = Array.isArray(data) ? data : [data]
  return template.evalute(stack)
}
