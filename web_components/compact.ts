// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Construct } from './types.ts'
import { watch, reach } from '../data_binding/mod.ts'
import { Variables, TreeTemplate, parse, evaluate } from '../template_engine/mod.ts'
import { patch, load, VirtualTree, LinkedVirtualTree } from '../virtual_dom/mod.ts'

export const builtin = {
  console,
  Object,
  Number,
  Math,
  Date,
  Array,
  JSON,
  String,
  isNaN,
  isFinite,
  location
}

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

class Component extends HTMLElement {
  template: TreeTemplate | null = null
  tree: LinkedVirtualTree | null = null
  stack: Variables | null = null
  attr: Record<string, unknown> = {}
  construct: Construct | null = null
  constructor() {
    super()
  }
  patch() {
    if (this.stack && this.tree && this.template) {
      patch(this.tree, evaluate(this.template, this.stack) as VirtualTree)
    }
  }
  static get observedAttributes() { return ['class', 'part', 'style'] }
  protected setRawAttribute(name: string, value: unknown) {
    console.log('setRawAttribute()', name, value)
    switch (name) {
      case 'class': case 'part': case 'style': return
      default:
        this.attr[name] = value
    }
    this.patch()
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

export function compact(template: string | TreeTemplate, stack: Variables | Record<string, unknown> | Construct = [], config: ShadowRootInit = {mode: 'open'}): Component {
  const temp: TreeTemplate = typeof template === 'string' ? parse(template) : template

  return class extends Component {
    constructor() {
      super()
      console.log('constructor()')
      this.template = temp
      this.tree = load(this.attachShadow(config))
      // 
      // this.tree = load(this)
      console.log('stack:', stack)
      if (typeof stack === 'function') {
        this.construct = stack;
        (async () => {
          if (this.construct) {
            const stack = await this.construct(this.attr)
            console.log('stack2:', stack)
            this.stack = stack ? (Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]) : [builtin] 
            this.construct = null
          }
          this.patch()
          reach(stack, this.patch)
        })().then()
      } else {
        this.stack = Array.isArray(stack) ? [builtin, ...stack] : [builtin, stack]
        this.patch()
        reach(stack, this.patch)
      }
      if (this.hasAttributes()) {
        this.getAttributeNames().forEach(name => {
          this.setRawAttribute(name, this.getAttribute(name))
        })
      }
    }
  } as unknown as Component
}
