// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Construct } from './types.ts'
import { reach } from '../data_binding/mod.ts'
import { Variables, TreeTemplate, parse, evaluate } from '../template_engine/mod.ts'
import { load } from '../virtual_dom/mod.ts'
import { Component } from './component.ts'

export const builtin = {
  console,
  Object,
  Number,
  Math,
  Date,
  Array,
  JSON,
  String,
  isNaN,
  isFinite,
  location
}


export function compact(template: string | TreeTemplate, stack: Variables | Record<string, unknown> | Construct = [], config: ShadowRootInit = {mode: 'open'}): Component {
  const temp: TreeTemplate = typeof template === 'string' ? parse(template) : template

  return class extends Component {
    constructor() {
      super()
      console.log('constructor()')
      this.template = temp
      this.tree = load(this.attachShadow(config))
      // 
      // this.tree = load(this)
      console.log('stack:', stack)
      if (typeof stack === 'function') {
        this.construct = stack;
        (async () => {
          if (this.construct) {
            const stack = await this.construct(this.attr)
            console.log('stack2:', stack)
            this.stack = stack ? (Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]) : [builtin] 
            this.construct = null
          }
          this.patch()
          reach(stack, this.patch)
        })().then()
      } else {
        this.stack = Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]
        this.patch()
        reach(stack, this.patch)
      }
      if (this.hasAttributes()) {
        this.getAttributeNames().forEach(name => {
          this.setRawAttribute(name, this.getAttribute(name))
        })
      }
    }
  } as unknown as Component
}
