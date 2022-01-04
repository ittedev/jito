// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component, instanceOfComponent } from './types.ts'
import {  } from './types.ts'
import { load, LinkedVirtualTree } from '../virtual_dom/mod.ts'
import { Entity } from './entity.ts'

const localComponentElementTag = 'beako-entity'

function proxyAttr(attr: Attr, setRawAttribute: (name: string, value: unknown) => void) {
  return new Proxy(attr, {
    set(target, prop, value) {
      setRawAttribute(prop as string, value)
      if (prop === 'value') {
        return target.value = value
      }
    }
  })
}

function proxyNamedNodeMap(attrs: NamedNodeMap, setRawAttribute: (name: string, value: unknown) => void) {
  return new Proxy(attrs, {
    get: function (target, prop) {
      if (prop === 'length') {
        return target[prop]
      } else {
        return proxyAttr(target[prop as unknown as number] as Attr, setRawAttribute)
      }
    }
  })
}

export class ComponentElement extends HTMLElement {
  tree: LinkedVirtualTree
  entity: Entity | undefined
  constructor() {
    super()
    this.tree = load(this.attachShadow({ mode: 'open' }))
    if (this.hasAttributes()) {
      this.getAttributeNames().forEach(name => {
        this.setRawAttribute(name, this.getAttribute(name))
      })
    }
  }
  static get observedAttributes() { return ['class', 'part', 'style'] }
  setRawAttribute(name: string, value: unknown) {
    this.entity?.setRawAttribute(name, value)
  }
  static getComponent(): Component | undefined {
    return undefined
  }

  // overwraps
  get attributes (): NamedNodeMap {
    return proxyNamedNodeMap(super.attributes, this.setRawAttribute)
  }
  setAttribute(name: string, value: unknown) {
    this.setRawAttribute(name, value)
    super.setAttribute(name, value as string)
  }
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
    console.log('attributeChangedCallback()', name, oldValue, newValue)
  }
  getAttributeNode(name: string): Attr | null {
    const attr = super.getAttributeNode(name)
    return attr ? proxyAttr(attr, this.setRawAttribute) : attr
  }
  removeAttribute(name: string) {
    this.setRawAttribute(name, undefined)
    return super.removeAttribute(name)
  }
  removeAttributeNode(attr: Attr) {
    this.setRawAttribute(attr.name, undefined)
    return super.removeAttributeNode(attr)
  }
  // not spport
  // getAttributeNodeNS()
  // ARIAMixin
  // connectedCallback() {
  //   console.log('connectedCallback()')
  // }
  // disconnectedCallback() {
  //   console.log('disconnectedCallback()')
  // }
}

class LocalComponentElement extends ComponentElement {
  constructor() {
    super()
  }
  setRawAttribute(name: string, value: unknown) {
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
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            this.entity = new Entity(value, this, this.tree)
          }
          break
      }
    }
    super.setRawAttribute(name, value)
  }
}

customElements.define(localComponentElementTag, LocalComponentElement)
