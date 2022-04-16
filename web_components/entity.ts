// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { ChangeCallback } from '../data_binding/types.ts'
import type { Component, SpecialCache, Patcher } from './types.ts'
import type {
  VirtualElement,
  RealTarget,
  VirtualTree,
  LinkedVirtualTree
} from '../virtual_dom/types.ts'
import type { TreeTemplate, Variables, Ref } from '../template_engine/types.ts'
import { special } from './types.ts'
import { instanceOfRef } from '../template_engine/types.ts'
import { watch } from '../data_binding/watch.ts'
import { reach } from '../data_binding/reach.ts'
import { unwatch } from '../data_binding/unwatch.ts'
import { parse } from '../template_engine/parse.ts'
import { evaluate } from '../template_engine/evaluate.ts'
import { patch } from '../virtual_dom/patch.ts'
import { hoist } from '../virtual_dom/hoist.ts'
import { concat } from '../virtual_dom/concat.ts'
import { builtin } from './builtin.ts'
import { eventTypes } from '../virtual_dom/event_types.ts'

export class Entity
{
  private _stack?: Variables | null
  private _patcher?: Patcher
  private _cache: SpecialCache
  private _component: Component
  private _template?: TreeTemplate
  private _host: Element
  private _tree: LinkedVirtualTree
  private _props: Record<string, unknown> = {}
  private _refs: Record<string, [Ref, ChangeCallback, ChangeCallback]> = {}
  private _running: Promise<void>
  private _requirePatch = false
  private _updater: SafeUpdater

  public constructor(component: Component, host: Element, tree: LinkedVirtualTree)
  {
    const root = tree.el as ShadowRoot
    this._component = component
    this._template = component.template
    this._patcher = component.patcher
    this._host = host
    this._tree = tree as LinkedVirtualTree
    this._updater = new SafeUpdater(tree)
    this._patch = this._patch.bind(this)
    this._cache = { [special]: [host, root] }

    if (this._component.options.mode === 'closed') {
      root.addEventListener(eventTypes.patch, event => event.stopPropagation())
    }
    host.addEventListener(eventTypes.destroy, () => {
      this._patch({ type: 'tree' })
    })

    const data = typeof this._component.data === 'function' ? this._component.data(this) : this._component.data;
    this._running = (async () => {
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

  public setProp(name: string, value: unknown)
  {
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

  public get component(): Component { return this._component }
  public get host(): Element { return this._host }
  public get root(): ShadowRoot { return this._tree.el as ShadowRoot }
  public get props(): Record<string, unknown> { return this._props }
  public get patch(){ return this._patch }
  public get dispatch(){ return this._dispatch }

  public get whenRunning()
  {
    return (): Promise<void> => this._running
  }

  private _patch(template?: string | TreeTemplate | Patcher): void
  {
    if (template) {
      if (typeof template === 'function') {
        this._patcher = template
        this._template = undefined
      } else {
        this._patcher = undefined
        this._template = typeof template === 'string' ? parse(template) : template
      }
    }
    if (!this._requirePatch) {
      this._requirePatch = true
      setTimeout(() => {
        this._requirePatch = false
        if (this._stack) {
          const tree =
            this._patcher ? this._patcher(this._stack) :
            this._template ? evaluate(this._template, this._stack, this._cache) as VirtualTree :
            this._tree && this._component.template ?
              evaluate(this._component.template, this._stack, this._cache) as VirtualTree :
              undefined
          if (tree) {
            this._updater.patch(tree)
          }
        }
      })
    }
  }

  private _dispatch(typeArg: string, detail: unknown = null): void
  {
    this._host.dispatchEvent(new CustomEvent(typeArg, {
      detail: detail
    }))
  }

  public toJSON()
  {
    return {
      component: this._component,
      props: this._props,
      tree: this._tree,
    }
  }
}

function isHoistingTarget(el: VirtualElement | RealTarget) {
  return 'tag' in el && (
    el.tag === 'style' ||
      el.tag === 'link' &&
      el.props?.href !== '' &&
      (el.props?.rel as string).toLocaleLowerCase() === 'stylesheet'
  )
}

export class SafeUpdater
{
  private header?: VirtualTree
  private body?: VirtualTree
  private _updateBody?: () => void
  private _waitUrls = new Set<string>()
  private loaded: (event: Event) => void

  public constructor(
    private tree: LinkedVirtualTree
  )
  {
    this.loaded = (event: Event) => {
      this.removeWaitUrl((event.target as HTMLLinkElement).href)
    }
  }

  public patch(tree: VirtualTree) {
    // hoisting link[rel="stylesheet"] element
    const header = hoist(tree, isHoistingTarget)
    const body = tree

    // compare new and old header
    // pick up load events
    if (header.children !== undefined || this.header?.children !== undefined) {
      const oldLinks = (this.header?.children?.filter(el => (el as VirtualElement).tag === 'link') || []) as Array<VirtualElement>
      const newLinks = (header.children?.filter(el => (el as VirtualElement).tag === 'link') || []) as Array<VirtualElement>
      newLinks
        .forEach(link => {
          if (!link.on) {
            link.on = {}
          }
          if (!link.on.load) {
            link.on.load = []
          }
          link.on.load.push(this.loaded)

          const url = link.props?.href as string
          if (oldLinks.every(el => el.props?.href !== link.props?.href)) {
            this.addWaitUrl(url)
          }
        })
      oldLinks
        .forEach(link => {
          const url = link.props?.href as string
          if (newLinks.every(el => el.props?.href !== link.props?.href)) {
            this.removeWaitUrl(url)
          }
        })

      // patch new header
      patch(this.tree, concat(header, this.body))
      this.header = header
    }

    // patch new body
    this.updateBody = () => {
      patch(this.tree, concat(this.header, body))
      this.body = body
    }
  }

  set updateBody(callback: () => void) {
    this._updateBody = callback
    this._executeUpdateBody()
  }

  addWaitUrl(url: string) {
    this._waitUrls.add(url)
  }

  removeWaitUrl(url: string) {
    this._waitUrls.delete(url)
    this._executeUpdateBody()
  }

  _executeUpdateBody() {
    if (!this._waitUrls.size && this._updateBody) {
      this._updateBody()
      this._updateBody = undefined
    }
  }
}
