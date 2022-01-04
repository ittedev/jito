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

export class Entity {
  private stack?: Variables | null
  private _component: Component
  private _el: Element
  private _tree: LinkedVirtualTree
  private _props: Record<string, unknown> = {}
  constructor( component: Component, el: Element, tree: LinkedVirtualTree ) {
    this._component = component
    this._el = el
    this._tree = tree

    if (typeof this.component.stack === 'function') {
      (async () => {
        const stack = await (this.component.stack as ComponentConstructor)(this)
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
    if (this.stack && this._tree && this.component.template) {
      patch(this._tree, evaluate(this.component.template, this.stack) as VirtualTree)
    }
  }
  setProp(name: string, value: unknown) {
    console.log('setProp()', name, value)
    switch (name) {
      case 'class': case 'part': case 'style': return
      default:
        this._props[name] = value
    }
    this.patch()
  }
  get component(): Component { return this._component }
  get el(): Element { return this._el }
  get root(): Element | DocumentFragment { return this._tree.node }
  get props(): Record<string, unknown> { return this._props }
}
