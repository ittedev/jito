// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component } from './types.ts'
import { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import { Variables } from '../template_engine/types.ts'
import { reach } from '../data_binding/reach.ts'
import { unwatch } from '../data_binding/unwatch.ts'
import { evaluate } from '../template_engine/evaluate.ts'
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
    this.patch = this.patch.bind(this)
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)

    const addStack = (stack: Variables) => {
      this._stack = [builtin, this._props, ...stack]
      reach(stack, this.patch)
      this.patch()
      stack.forEach(data => {
        if (typeof data === 'object' && data !== null) {
          for (const name in data) {
            if (
              typeof data[name] === 'function' && // The value is function
              isNaN(name as unknown as number) && // The name is not number
              !(name in this._el) // Do not override same property name
            ) {
              // deno-lint-ignore ban-types
              const method = (data[name] as Function).bind(this)
              Object.defineProperty(this._el, name, {
                get () { return method }
              })
            }
          }
        }
      })
    }

    if (typeof this._component.data === 'function') {
      const data = this._component.data(this)
      if (data instanceof Promise) {
        (async () => {
          const result = await data
          addStack(result ? Array.isArray(result) ? result : [result] : [])
        })().then()
      } else {
        addStack(data ? Array.isArray(data) ? data : [data] : [])
      }
    } else {
      const stack = this._component.data
      addStack(stack)
    }
  }

  setProp(name: string, value: unknown) {
    switch (name) {
      case 'is': case 'class': case 'part': case 'style': return
      default: {
        const old = this._props[name]
        if (old !== value) {
          unwatch(old, this.patch)
          this._props[name] = value
          reach(this._props[name], this.patch)
          this.patch()
        }
      }
    }
  }

  _unwatch() {
    unwatch(this._stack, this.patch)
  }

  get component(): Component { return this._component }
  get node(): Element { return this._el }
  get root(): ShadowRoot { return this._tree.node as ShadowRoot }
  get props(): Record<string, unknown> { return this._props }

  private patch (): void {
    if (this._stack && this._tree && this._component.template) {
      // patch(this._tree, evaluate(this._component.template, this.stack) as VirtualTree)
      const tree = evaluate(this._component.template, this._stack) as VirtualTree
      // console.log('patch:', this._tree, tree)
      patch(this._tree, tree)
    }
  }

  private on(type: string, listener: EventListener): void
  private on(type: string, listener: EventListener, options: EventListenerOptions): void
  private on(type: string, listener: EventListener, useCapture: boolean): void
  private on(type: string, listener: EventListener, options: boolean | EventListenerOptions = false): void {
    this._el.addEventListener(type, listener, options)
  }

  private off(type: string, listener: EventListener): void
  private off(type: string, listener: EventListener, options: EventListenerOptions): void
  private off(type: string, listener: EventListener, useCapture: boolean): void
  private off(type: string, listener: EventListener, options: boolean | EventListenerOptions = false): void {
    this._el.removeEventListener(type, listener, options)
  }
}
