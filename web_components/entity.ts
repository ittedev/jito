// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import { Variables } from '../template_engine/types.ts'
import { reach } from '../data_binding/reach.ts'
import { unwatch } from '../data_binding/unwatch.ts'
import { evaluate } from '../template_engine/evaluate.ts'
import { clone } from '../virtual_dom/clone.ts'
import { patch } from '../virtual_dom/patch.ts'
import { builtin } from './builtin.ts'

export class Entity {
  private _stack?: Variables | null
  private _component: Component
  private _el: Element
  private _tree: LinkedVirtualTree
  private _props: Record<string, unknown> = {}
  constructor( component: Component, el: Element, tree: LinkedVirtualTree ) {
    this._component = component
    this._el = el
    this._tree = tree as LinkedVirtualTree
    this._patch = this._patch.bind(this)
    this._on = this._on.bind(this)
    this._off = this._off.bind(this)

    if (typeof this._component.stack === 'function') {
      (async () => {
        const stack = await (component.stack as ComponentConstructor)(this)
        this._stack = [builtin, this._props, ...(stack ? Array.isArray(stack) ? stack : [stack] : [])]
        reach(stack, this._patch)
        this._patch()
      })().then()
    } else {
      this._stack = [builtin, this._props, ...this._component.stack]
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
    unwatch(this._stack, this._patch)
  }
  get component(): Component { return this._component }
  get node(): Element { return this._el }
  get root(): ShadowRoot { return this._tree.node as ShadowRoot }
  get props(): Record<string, unknown> { return this._props }
  get patch() { return this._patch }
  get on() { return this._on }
  get off() { return this._off }

  private _patch (): void {
    if (this._stack && this._tree && this._component.template) {
      // patch(this._tree, evaluate(this._component.template, this.stack) as VirtualTree)
      const tree = evaluate(this._component.template, this._stack) as VirtualTree
      // console.log('patch:', this._tree, tree)
      patch(this._tree, tree)
      this._el.dispatchEvent(new CustomEvent('patched', {
        bubbles: true,
        composed: true,
        detail: {
          tree: clone(this._tree)
        }
      }))
    }
  }

  private _on(type: string, listener: EventListener): void
  private _on(type: string, listener: EventListener, options: EventListenerOptions): void
  private _on(type: string, listener: EventListener, useCapture: boolean): void
  private _on(type: string, listener: EventListener, options: boolean | EventListenerOptions = false): void {
    this._el.addEventListener(type, listener, options)
  }

  private _off(type: string, listener: EventListener): void
  private _off(type: string, listener: EventListener, options: EventListenerOptions): void
  private _off(type: string, listener: EventListener, useCapture: boolean): void
  private _off(type: string, listener: EventListener, options: boolean | EventListenerOptions = false): void {
    this._el.removeEventListener(type, listener, options)
  }
}
