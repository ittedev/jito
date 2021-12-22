// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { watch, reach } from '../observer/mod.ts'
import { Variables, TreeTemplate, parse, evalute } from '../template_engine/mod.ts'
import { patch, load, VirtualTree } from '../virtual_dom/mod.ts'
import { Component } from './types.ts'

export function hack(selectors: string, template: string, stack: Variables): void
export function hack(selectors: string, template: TreeTemplate, stack: Variables): void
export function hack(selectors: string, component: Component): void
export function hack(element: Element, template: string, stack: Variables): void
export function hack(element: Element, template: TreeTemplate, stack: Variables): void
export function hack(element: Element, component: Component): void
export function hack(doc: Document, template: string, stack: Variables): void
export function hack(doc: Document, template: TreeTemplate, stack: Variables): void
export function hack(doc: Document, component: Component): void
export function hack(element: string | Element | Document, template: string | TreeTemplate | Component, stack?: Variables): void {
  const parent: Element =
    typeof element === 'string' ?
      document.querySelector(element) as Element :
    element.nodeType === 9 ? // DOCUMENT_NODE
      (element as Document).body :
      element as Element

  
  if (template instanceof HTMLElement) {
    
  } else {
    const treeTemplate: TreeTemplate =
      typeof template === 'string' ? parse(template) : template as TreeTemplate
    
    const shadow = parent.attachShadow({mode: 'open'})
    const tree = load(shadow)
    const patchTree = () => patch(tree, evalute(treeTemplate, stack) as VirtualTree)
    const update = (obj: unknown) => {
      watch(obj, '', patchTree)
    }
    reach(stack, update)
  }
}

