// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ChangeCallback } from '../data_binding/types.ts'
import { special, Component, SpecialCache } from './types.ts'
import { VirtualTree, LinkedVirtualTree } from '../virtual_dom/types.ts'
import { Variables, instanceOfRef, Ref } from '../template_engine/types.ts'
import { watch } from '../data_binding/watch.ts'
import { reach } from '../data_binding/reach.ts'
import { unwatch } from '../data_binding/unwatch.ts'
import { evaluate } from '../template_engine/evaluate.ts'
import { patch } from '../virtual_dom/patch.ts'
import { builtin } from './builtin.ts'
import { eventTypes } from '../virtual_dom/event_types.ts'

export class Entity {
  private _stack?: Variables | null
  private _cache: SpecialCache
  private _component: Component
  private _host: Element
  private _tree: LinkedVirtualTree
  private _props: Record<string, unknown> = {}
  private _refs: Record<string, [Ref, ChangeCallback, ChangeCallback]> = {}
  private _constructor: Promise<void>

  constructor( component: Component, host: Element, tree: LinkedVirtualTree ) {
    const root = tree.el as ShadowRoot
    this._component = component
    this._host = host
    this._tree = tree as LinkedVirtualTree
    this._patch = this._patch.bind(this)
    this._cache = { [special]: [host, root] }

    if (this._component.options.mode === 'closed') {
      root.addEventListener(eventTypes.patch, event => event.stopPropagation())
    }

    const data = typeof this._component.data === 'function' ? this._component.data(this) : this._component.data;
    this._constructor = (async () => {
      const result = await data
      const stack = result ? Array.isArray(result) ? result : [result] : []
      this._stack = [builtin, { host, root }, watch(this._props), ...stack]
      reach(this._stack, this._patch)
      this._patch()
      stack.forEach(data => {
        if (typeof data === 'object' && data !== null) {
          for (const name in data) {
            if (
              typeof data[name] === 'function' && // The value is function
              isNaN(name as unknown as number) && // The name is not number
              !(name in this._host) // Do not override same property name
            ) {
              // deno-lint-ignore ban-types
              const method = (data[name] as Function).bind(this)
              Object.defineProperty(this._host, name, {
                get () { return method }
              })
            }
          }
        }
      })
    })().then()
  }

  setProp(name: string, value: unknown) {
    // console.log('setProp:', name, value)
    switch (name) {
      case 'is': case 'class': case 'part': case 'style': return
      default: {
        const old = this._props[name]
        if (old !== value) {
          if (name in this._refs) {
            const ref = this._refs[name][0]
            if (instanceOfRef(value) && value.record === ref.record) {
              return
            } else {
              unwatch(this._props, name, this._refs[name][1])
              unwatch(ref.record, ref.key as string, this._refs[name][2])
              delete this._refs[name]
            }
          }
          unwatch(old, this._patch)
          if (instanceOfRef(value)) { // ref prop
            const childCallback = (newValue: unknown) => {
              value.record[value.key] = newValue
            }
            const parentCallback = (newValue: unknown) => {
              this._props[name] = newValue
            }
            this._refs[name] = [value, childCallback, parentCallback]
            watch(this._props, name, childCallback)
            watch(value.record, value.key as string, parentCallback)
            this._props[name] = value.record[value.key]
          } else {
            this._props[name] = value
          }
          if (old === undefined) {
            watch(this._props, name, this._patch)
          }
          reach(this._props, this._patch)
          this._patch()
        }
      }
    }
  }

  _unwatch() {
    for (const name in this._refs) {
      const ref = this._refs[name][0]
      unwatch(this._props, name, this._refs[name][1])
      unwatch(ref.record, ref.key as string, this._refs[name][2])
    }
    unwatch(this._stack, this._patch)
  }

  get component(): Component { return this._component }
  get host(): Element { return this._host }
  get root(): ShadowRoot { return this._tree.el as ShadowRoot }
  get props(): Record<string, unknown> { return this._props }
  get patch() { return this._patch }
  get whenConstructed() {
    return (): Promise<void> | null => this._constructor
  }

  private _patch (): void {
    if (this._stack && this._tree && this._component.template) {
      // patch(this._tree, evaluate(this._component.template, this.stack) as VirtualTree)
      const tree = evaluate(this._component.template, this._stack, this._cache) as VirtualTree
      patch(this._tree, tree)
    }
  }
}
