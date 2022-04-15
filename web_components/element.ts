// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Component } from './types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { Entity } from './entity.ts'

export const componentElementTag = 'beako-element'

export class ComponentElement extends HTMLElement
{
  private _entity?: Entity
  private _run?: (value: void | PromiseLike<void>) => void

  constructor()
  {
    super()
  }

  setProp(name: string, value: unknown)
  {
    this._entity?.setProp(name, value)
  }

  static getComponent(): Component | undefined
  {
    return undefined
  }

  loadProps()
  {
    if (this.hasAttributes()) {
      this.getAttributeNames().forEach(name => {
        this.setProp(name, this.getAttribute(name))
      })
    }
  }

  whenRunning(): Promise<void>
  {
    if (this._entity) {
      return this._entity.whenRunning()
    } else {
      return new Promise<void>(resolve => {
        this._run = resolve
      })
    }
  }

  protected _setEntity(entity: Entity)
  {
    this._entity = entity
    if (this._run) {
      this._entity.whenRunning().then(this._run)
    }
  }

  get entity()
  {
    return this._entity
  }

  // overwraps
  get attributes(): NamedNodeMap
  {
    return proxyNamedNodeMap(super.attributes, this.setProp)
  }

  setAttribute(name: string, value: unknown)
  {
    this.setProp(name, value)
    super.setAttribute(name, value as string)
  }

  getAttributeNode(name: string): Attr | null
  {
    const attr = super.getAttributeNode(name)
    return attr ? proxyAttr(attr, this.setProp) : attr
  }

  removeAttribute(name: string)
  {
    this.setProp(name, undefined)
    return super.removeAttribute(name)
  }

  removeAttributeNode(attr: Attr)
  {
    this.setProp(attr.name, undefined)
    return super.removeAttributeNode(attr)
  }

  toJSON() {
    return {
      entity: this._entity
    }
  }

  // not spport
  // getAttributeNodeNS()
  // ARIAMixin
}

class GrobalComponentElement extends ComponentElement
{
  constructor() {
    super()
  }

  setProp(name: string, value: unknown)
  {
    // if change a component property
    if (name === 'component') {
      switch (typeof value) {
        case 'string': {
          const def = customElements.get(value)
          // deno-lint-ignore no-prototype-builtins
          if (def && ComponentElement.isPrototypeOf(def)) {
            const component = (def as typeof ComponentElement).getComponent()
            if (component) {
              const tree = load(this.attachShadow(component.options))
              this._setEntity(new Entity(component, this, tree))
            }
          } else {
            throw Error(value + ' is not a component.')
          }
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            const tree = load(this.attachShadow(value.options))
            this._setEntity(new Entity(value, this, tree))
          } else if (value !== null) {
            throw Error('The object is not a component.')
          }
          break
      }
    }
    super.setProp(name, value)
  }
}

customElements.define(componentElementTag, GrobalComponentElement)

function proxyAttr(attr: Attr, setProp: (name: string, value: unknown) => void)
{
  return new Proxy(attr, {
    set(target, prop, value) {
      setProp(prop as string, value)
      if (prop === 'value') {
        return target.value = value
      }
    }
  })
}

function proxyNamedNodeMap(
  attrs: NamedNodeMap,
  setProp: (name: string, value: unknown) => void
)
{
  return new Proxy(attrs, {
    get: function (target, prop) {
      if (prop === 'length') {
        return target[prop]
      } else {
        return proxyAttr(target[prop as unknown as number] as Attr, setProp)
      }
    }
  })
}