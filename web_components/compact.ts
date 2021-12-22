// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component } from './types.ts'
import { watch, reach } from '../observer/mod.ts'
import { Variables, TreeTemplate, parse, evalute } from '../template_engine/mod.ts'
import { patch, load, VirtualTree } from '../virtual_dom/mod.ts'

const builtin = {
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

export function compact(template: string | TreeTemplate, stack: Variables): Component {

  const treeTemplate: TreeTemplate =
    typeof template === 'string' ? parse(template) : template

  return class extends HTMLElement {
    constructor() {
      super();
      console.log('constructor()');
      const shadow = this.attachShadow({mode: 'open'})
      const tree = load(shadow)
      const patchTree = () => patch(tree, evalute(treeTemplate, stack) as VirtualTree)
      reach(stack, (obj: unknown) => {
        watch(obj, '', patchTree)
      })
      const _stack = [builtin, ...stack]
    }
    log() {
      console.log('hello');
    }
    connectedCallback() {
      console.log('connectedCallback()');
    }
    disconnectedCallback() {
      console.log('disconnectedCallback()');
    }
    adoptedCallback() {
      console.log('adoptedCallback()');
    }
  } as unknown as Component
}

export const test = class extends HTMLElement {
  constructor() {
    super()
    console.log('constructor()')
  }
  log () {
    console.log('hello')
  }
  connectedCallback() {
    console.log('connectedCallback()');
  }
  disconnectedCallback() {
    console.log('disconnectedCallback()');
  }
  adoptedCallback() {
    console.log('adoptedCallback()');
  }
}