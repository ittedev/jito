// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component, instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { Entity } from './entity.ts'

export const localComponentElementTag = 'beako-entity'

export class ComponentElement extends HTMLElement {
  entity: Entity | undefined
  constructor() {
    super()
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
  whenConstructed(): Promise<void> | null {
    return this.entity?.whenConstructed() || null
  }

  // overwraps
  get attributes(): NamedNodeMap {
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
              const tree = load(this.attachShadow({ mode: component.options.mode, delegatesFocus: component.options.delegatesFocus }))
              this.entity = new Entity(component, this, tree)
            }
          } else {
            throw Error(value + ' is not a component.')
          }
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            const tree = load(this.attachShadow({ mode: value.options.mode, delegatesFocus: value.options.delegatesFocus }))
            this.entity = new Entity(value, this, tree)
          } else {
            throw Error('The object is not a component.')
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
