// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component } from './types.ts'
// import { watch, reach } from '../observer/mod.ts'
import { Variables, TreeTemplate, parse, evaluate } from '../template_engine/mod.ts'
import { patch, load, VirtualTree, LinkedVirtualTree } from '../virtual_dom/mod.ts'

const builtin = {
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

export function compact(template: string | TreeTemplate, stack: Variables = []): Component {
  const temp: TreeTemplate = typeof template === 'string' ? parse(template) : template

  return class extends HTMLElement {
    template: TreeTemplate
    tree: LinkedVirtualTree
    stack: Variables
    attr: Record<string, unknown> | null = null
    constructor() {
      super()
      console.log('constructor()')
      const shadow = this.attachShadow({mode: 'open'})
      this.template = temp
      this.tree = load(shadow)
      this.stack = [builtin, ...stack]
      // reach(stack, (obj: unknown) => {
      //   watch(obj, '', patchTree)
      // })
      this.patch()
    }
    patch() {
      patch(this.tree, evaluate(this.template, this.stack) as VirtualTree)
    }
    connectedCallback() {
      console.log('connectedCallback()')
    }
    disconnectedCallback() {
      console.log('disconnectedCallback()')
    }
    adoptedCallback() {
      console.log('adoptedCallback()')
    }
    get rawAttributes() {
      return this.attr
    }
    set rawAttributes(attr) {
      this.attr = attr
    }
  } as unknown as Component
}
