// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { VirtualElement } from '../virtual_dom/VirtualElement.ts'
import { Template } from './types.ts'

export function generate(template: Template, data?: Object): VirtualElement {
  return { tag: 'body' }
}
