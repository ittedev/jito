// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { reach } from '../data_binding/mod.ts'
import { Variables, evaluate } from '../template_engine/mod.ts'
import { VirtualTree, LinkedVirtualTree, patch } from '../virtual_dom/mod.ts'

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

export class Core {
  protected stack?: Variables | null
  constructor(
    public component: Component,
    protected tree: LinkedVirtualTree | null = null,
    protected attr: Record<string, unknown> = {}
  ) {
    if (typeof this.component.stack === 'function') {
      (async () => {
        const stack = await (this.component.stack as ComponentConstructor)(this.attr)
        this.stack = stack ? (Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]) : [builtin] 
        this.patch()
        reach(stack, this.patch)
      })().then()
    } else {
      reach(this.component.stack, this.patch)
      this.stack = [builtin, ...this.component.stack]
      this.patch()
    }
  }
  patch() {
    if (this.stack && this.tree && this.component.template) {
      patch(this.tree, evaluate(this.component.template, this.stack) as VirtualTree)
    }
  }
  setRawAttribute(name: string, value: unknown) {
    console.log('setRawAttribute()', name, value)
    switch (name) {
      case 'class': case 'part': case 'style': return
      default:
        this.attr[name] = value
    }
    this.patch()
  }
}
