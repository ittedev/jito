// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component, instanceOfComponent } from './types.ts'
import { LinkedVirtualTree } from '../virtual_dom/types.ts'
import { load } from '../virtual_dom/load.ts'
import { Entity } from './entity.ts'

export const localComponentElementTag = 'beako-entity'

export class ComponentElement extends HTMLElement {
  tree: LinkedVirtualTree
  entity: Entity | undefined
  constructor() {
    super()
    this.tree = load(this.attachShadow({ mode: 'open' }))
  }
  // static get observedAttributes() { return ['class', 'part', 'style'] }
  setProp(name: string, value: unknown) {
    this.entity?.setProp(name, value)
  }
  static getComponent(): Component | undefined {
    return undefined
  }
  loadProps() {
    if (this.hasAttributes()) {
      this.getAttributeNames().forEach(name => {
        this.setProp(name, this.getAttribute(name))
      })
    }
  }

  // overwraps
  get attributes (): NamedNodeMap {
    return proxyNamedNodeMap(super.attributes, this.setProp)
  }
  setAttribute(name: string, value: unknown) {
    this.setProp(name, value)
    super.setAttribute(name, value as string)
  }
  // attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
  //   // console.log('attributeChangedCallback()', name, oldValue, newValue)
  // }
  getAttributeNode(name: string): Attr | null {
    const attr = super.getAttributeNode(name)
    return attr ? proxyAttr(attr, this.setProp) : attr
  }
  removeAttribute(name: string) {
    this.setProp(name, undefined)
    return super.removeAttribute(name)
  }
  removeAttributeNode(attr: Attr) {
    this.setProp(attr.name, undefined)
    return super.removeAttributeNode(attr)
  }
  connectedCallback() {
    this.dispatchEvent(new CustomEvent('connected', { bubbles: false }))
  }
  disconnectedCallback() {
    this.dispatchEvent(new CustomEvent('disconnected', { bubbles: false }))
  }

  // not spport
  // getAttributeNodeNS()
  // ARIAMixin
}

class LocalComponentElement extends ComponentElement {
  constructor() {
    super()
  }
  setProp(name: string, value: unknown) {
    if (name === 'component') {
      switch (typeof value) {
        case 'string': {
          const def = customElements.get(value)
          // deno-lint-ignore no-prototype-builtins
          if (def && ComponentElement.isPrototypeOf(def)) {
            const component = (def as typeof ComponentElement).getComponent()
            if (component) {
              this.entity = new Entity(component, this, this.tree)
            }
          }
          // TODO: add error
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            if (this.entity?.component !== value) {
              this.entity?._unwatch()
              // TODO: clear shadow root
              this.entity = new Entity(value, this, this.tree)
            }
          } else {
            throw Error(value + ' is not a component.')
          }
          break
      }
    }
    super.setProp(name, value)
  }
}

customElements.define(localComponentElementTag, LocalComponentElement)

function proxyAttr(attr: Attr, setProp: (name: string, value: unknown) => void) {
  return new Proxy(attr, {
    set(target, prop, value) {
      setProp(prop as string, value)
      if (prop === 'value') {
        return target.value = value
      }
    }
  })
}

function proxyNamedNodeMap(attrs: NamedNodeMap, setProp: (name: string, value: unknown) => void) {
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
