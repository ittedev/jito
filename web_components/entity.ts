// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import { Variables } from '../template_engine/types.ts'
import { reach } from '../data_binding/reach.ts'
import { evaluate } from '../template_engine/evaluate.ts'
import { patch } from '../virtual_dom/patch.ts'

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

    if (typeof this._component.stack === 'function') {
      (async () => {
        const stack = await (component.stack as ComponentConstructor)(this)
        this.stack = stack ? (Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]) : [builtin] 
        const f = () => this.patch()
        reach(stack, f)
      })().then()
    } else {
      this.stack = [builtin, ...this._component.stack]
      const f = () => this.patch()
      reach(this._component.stack, f)
      this.patch()
    }
  }
  patch() {
    if (this.stack && this._tree && this._component.template) {
      patch(this._tree, evaluate(this._component.template, this.stack) as VirtualTree)
    }
  }
  setProp(name: string, value: unknown) {
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
