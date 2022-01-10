// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import { Variables } from '../template_engine/types.ts'
import { reach } from '../data_binding/reach.ts'
import { unwatch } from '../data_binding/unwatch.ts'
import { evaluate } from '../template_engine/evaluate.ts'
import { patch } from '../virtual_dom/patch.ts'
import { builtin } from './builtin.ts'

export class Entity {
  private stack?: Variables | null
  private _component: Component
  private _el: Element
  private _tree: LinkedVirtualTree
  private _props: Record<string, unknown> = {}
  private _patch: () => void = () => {
    if (this.stack && this._tree && this._component.template) {
      const tree = evaluate(this._component.template, this.stack) as VirtualTree
      // console.log('patch:', this._tree, tree)
      patch(this._tree, tree)
      // patch(this._tree, evaluate(this._component.template, this.stack) as VirtualTree)
    }
  }
  constructor( component: Component, el: Element, tree: LinkedVirtualTree ) {
    this._component = component
    this._el = el
    this._tree = tree as LinkedVirtualTree

    if (typeof this._component.stack === 'function') {
      (async () => {
        const stack = await (component.stack as ComponentConstructor)(this)
        this.stack = [builtin, this._props, ...(stack ? Array.isArray(stack) ? stack : [stack] : [])]
        reach(stack, this._patch)
        this._patch()
      })().then()
    } else {
      this.stack = [builtin, this._props, ...this._component.stack]
      reach(this._component.stack, this._patch)
      this._patch()
    }
  }
  setProp(name: string, value: unknown) {
    switch (name) {
      case 'is': case 'class': case 'part': case 'style': return
      default: {
        const old = this._props[name]
        if (old !== value) {
          unwatch(old, this._patch)
          this._props[name] = value
          reach(this._props[name], this._patch)
          this._patch()
        }
      }
    }
  }
  _unwatch() {
    unwatch(this.stack, this._patch)
  }
  get component(): Component { return this._component }
  get el(): Element { return this._el }
  get root(): Element | DocumentFragment { return this._tree.node }
  get props(): Record<string, unknown> { return this._props }
  get patch(): () => void { return this._patch }
}
