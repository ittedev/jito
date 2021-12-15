// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { instanceOfTemplate, Variables, Template } from '../types.ts'
import { VirtualElement } from '../../virtual_dom/types.ts'

export class ElementTemplate implements Template<VirtualElement> {
  constructor(
    private template: {
      tag: string,
      class: Array<Array<string> | Template<Array<string>>>,
      part: Array<Array<string> | Template<Array<string>>>,
      attr: Record<string, unknown | Template<unknown>>,
      style: string | Template<string>,
      bind: object
    }
  ) {}
  evalute(stack: Variables): VirtualElement {
    // TODO
    const tree = { tag: this.template.tag } as VirtualElement
    if (this.template.style) {
      tree.style = typeof this.template.style === 'string' ? this.template.style: this.template.style.evalute(stack)
    }
    return tree
  }
  optimize(): VirtualElement | Template<VirtualElement> {
    // TODO
    return { tag: this.template.tag } as VirtualElement
  }
}