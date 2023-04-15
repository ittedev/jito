// deno-lint-ignore-file no-explicit-any
import type {
  RecursiveCallback,
  TargetCallback,
} from '../data_binding/types.ts'
import type {
  Component,
  SpecialCache,
  Patcher,
  TakeOptions,
} from './types.ts'
import type {
  VirtualElement,
  RealTarget,
  VirtualTree,
  LinkedVirtualTree,
  VirtualNode
} from '../virtual_dom/types.ts'
import type { TreeTemplate, StateStack, Ref } from '../template_engine/types.ts'
import { special } from './types.ts'
import { instanceOfRef } from '../template_engine/types.ts'
import { watch } from '../data_binding/watch.ts'
import { receive } from '../data_binding/receive.ts'
import { change } from '../data_binding/change.ts'
import { reach } from '../data_binding/reach.ts'
import { unreach } from '../data_binding/unreach.ts'
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
  private _stack?: StateStack | null
  private _patcher?: Patcher
  private _cache: SpecialCache
  private _component: Component
  private _template?: TreeTemplate
  private _host: Element
  private _tree: LinkedVirtualTree
  private _attrs: Record<string, unknown> = {}
  private _refs: Record<string, [Ref, TargetCallback, TargetCallback]> = {}
  private _ready: Promise<void>
  private _requirePatch = false
  private _updater: SafeUpdater
  private _watcher: Set<[unknown, RecursiveCallback | string | undefined, TargetCallback | boolean | undefined]>

  public constructor(component: Component, host: Element, tree: LinkedVirtualTree)
  {
    let root = tree.el as ShadowRoot
    this._component = component
    this._template = component.template
    this._patcher = component.patcher
    this._host = host
    this._tree = tree as LinkedVirtualTree
    this._updater = new SafeUpdater(tree)
    this._watcher = new Set()
    this.patch = this.patch.bind(this)
    this.watch = this.watch.bind(this)
    this.take = this.take.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this._cache = { [special]: [host, root] }

    if (this._component.options.mode === 'closed') {
      root.addEventListener(eventTypes.patch, event => event.stopPropagation())
    }
    host.addEventListener(eventTypes.destroy, () => {
      this.patch({ type: 'tree' })
      this._watcher.forEach(value => unwatch(...(value as [unknown, string, TargetCallback])))
      unreach(this._stack, this.patch)
    })

    let main = typeof this._component.main === 'function' ? this._component.main(this) : this._component.main;
    this._ready = (async () => {
      let result = await main
      let stack = result ? Array.isArray(result) ? result : [result] : []
      this._stack = [builtin, { host, root }, watch(this._attrs), ...stack]
      reach(this._stack, this.patch)
      this.patch()
      stack.forEach(state => {
        if (typeof state === 'object' && state !== null) {
          for (let name in state) {
            if (
              (typeof state[name] === 'function' || state[name] instanceof Element) && // The value is function or Element
              isNaN(name as unknown as number) && // The name is not number
              !(name in this._host) // Do not override same property name
            ) {
              let datum =
                typeof state[name] === 'function' ?
                  // deno-lint-ignore ban-types
                  (state[name] as Function).bind(this) :
                  state[name]
              Object.defineProperty(this._host, name, {
                get () { return datum }
              })
            }
          }
        }
      })
    })()
  }

  public setAttr(name: string, value: unknown): void
  {
    switch (name) {
      case 'is': case 'class': case 'part': case 'style': return
      default: {
        let old = this._attrs[name]
        if (old !== value) {
          if (name in this._refs) {
            let ref = this._refs[name][0]
            if (instanceOfRef(value) && value.record === ref.record) {
              return
            } else {
              unwatch(this._attrs, name, this._refs[name][1])
              unwatch(ref.record, ref.key as string, this._refs[name][2])
              delete this._refs[name]
            }
          }
          if (instanceOfRef(value)) { // ref attr
            let childCallback = (newValue: unknown) => {
              value.record[value.key] = newValue
            }
            let parentCallback = (newValue: unknown) => {
              this._attrs[name] = newValue
            }
            this._refs[name] = [value, childCallback, parentCallback]
            watch(this._attrs, name, childCallback)
            watch(value.record, value.key as string, parentCallback)
            change(this._attrs, name, value.record[value.key])
          } else {
            change(this._attrs, name, value)
          }
        }
      }
    }
  }

  public get component(): Component { return this._component }
  public get host(): Element { return this._host }
  public get root(): ShadowRoot { return this._tree.el as ShadowRoot }
  public get attrs(): Record<string, unknown> { return this._attrs }

  public get ready(): () => Promise<void>
  {
    return (): Promise<void> => this._ready
  }

  public patch(template?: string | TreeTemplate | Patcher): void
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
          let tree =
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

  public dispatch(typeArg: string, detail: unknown = null): void
  {
    this._host.dispatchEvent(new CustomEvent(typeArg, {
      detail: detail
    }))
  }

  public watch<T>(data: T): T
  public watch<T>(data: T, callback: RecursiveCallback, isExecute?: boolean): T
  public watch<T>(data: T, key: string, callback: TargetCallback, isExecute?: boolean): T
  public watch<T>(
    data: T,
    keyOrCallback?:  RecursiveCallback | string,
    isExecuteOrcallback?: TargetCallback | boolean,
    isExecute?: boolean,
  ): T
  {
    this._watcher.add([data, keyOrCallback, isExecuteOrcallback])
    return watch(data, keyOrCallback as string, isExecuteOrcallback as TargetCallback, isExecute)
  }

  public async take<T>(options: TakeOptions): Promise<T>
  {
    let keys = Object.entries(options)
      .filter(entry => typeof entry[1] === 'object' && entry[1] !== null && !('default' in entry[1]) || (typeof entry[1] === 'boolean' && entry[1]))
      .map(entry => entry[0])
    Object.entries(options)
      .filter(entry => typeof entry[1] === 'object' && entry[1] !== null && 'default' in entry[1])
      .forEach(entry => {
        if (!(entry[0] in this._attrs)) {
          this._attrs[entry[0]] = (entry[1] as { default: unknown }).default
        }
      })
    await receive(this._attrs, keys)
    return this._attrs as T
  }

  public toJSON()
  {
    return {
      component: this._component,
      attrs: this._attrs,
      tree: this._tree,
    }
  }
}

function isHoistingTarget(el: VirtualElement | RealTarget) {
  return 'tag' in el && (el.tag === 'style' || el.tag === 'link')
}

function isWaitingTarget(el: VirtualNode) {
  return (el as VirtualElement).tag === 'link' &&
    ((el as VirtualElement).attrs && ((el as VirtualElement).attrs as any).href) !== '' &&
    (((el as VirtualElement).attrs && ((el as VirtualElement).attrs as any).rel) as string).toLocaleLowerCase() === 'stylesheet'
}

/**
 * Stop rendering until the link tag has finished loading
 */
class SafeUpdater
{
  private header?: VirtualTree
  private body?: VirtualTree
  private _update?: () => void
  private _waitUrls = new Set<string>()
  private loaded = (event: Event) => {
    this.removeWaitUrl((event.target as HTMLLinkElement).getAttribute('href') as string)
  }

  public constructor(
    private tree: LinkedVirtualTree
  ) {}

  public patch(tree: VirtualTree) {
    // hoisting link[rel="stylesheet"] element
    let header = hoist(tree, isHoistingTarget)
    let body = tree

    // pre patch
    let oldLinks = (this.header && this.header.children && this.header.children.filter(isWaitingTarget) || []) as Array<VirtualElement>
    let newLinks = (header.children && header.children.filter(isWaitingTarget) || []) as Array<VirtualElement>
    let addedLinks = newLinks
      .filter(link => oldLinks.every(el => (el.attrs && el.attrs.href) !== (link.attrs && link.attrs.href)))
    let removedLinks = oldLinks
      .filter(link => newLinks.every(el => (el.attrs && el.attrs.href) !== (link.attrs && link.attrs.href)))

    // set a load event listener
    newLinks.forEach(link => {
      if (!link.on) {
        link.on = {}
      }
      if (!link.on.load) {
        link.on.load = []
      }
      if (!link.on.load.includes(this.loaded)) {
        link.on.load.push(this.loaded)
      }
      if (!link.on.error) {
        link.on.error = []
      }
      if (!link.on.error.includes(this.loaded)) {
        link.on.error.push(this.loaded)
      }
    })

    // add to wait list
    addedLinks.forEach(link => {
      this.addWaitUrl((link.attrs && link.attrs.href) as string)
      link.new = true
    })

    // remove from wait list
    removedLinks.forEach(link => this.removeWaitUrl((link.attrs && link.attrs.href) as string))

    if (removedLinks.length) {
      // patch old header and new header
      // because href may have changed
      patch(this.tree, concat(this.header, header, this.body), false)
    } else {
      // patch new header
      patch(this.tree, concat(header, this.body), false)
    }

    // remove new flag
    addedLinks.forEach(link => link.new = false)

    this.header = header

    // patch new body
    this.update = () => {
      patch(this.tree, concat(this.header, body))

      // remove new
      hoist(body, el => {
        delete (el as VirtualElement).new
        return false
      })

      this.body = body
    }
  }

  set update(callback: () => void) {
    this._update = callback
    this._executeUpdate()
  }

  addWaitUrl(url: string) {
    this._waitUrls.add(url)
  }

  removeWaitUrl(url: string) {
    this._waitUrls.delete(url)
    this._executeUpdate()
  }

  _executeUpdate() {
    if (!this._waitUrls.size && this._update) {
      this._update()
      this._update = undefined
    }
  }
}
