// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { reach } from '../data_binding/mod.ts'
import { Variables, TreeTemplate, parse, evaluate } from '../template_engine/mod.ts'
import { patch, load, VirtualTree } from '../virtual_dom/mod.ts'

export function hack(selectors: string, template: string, stack: Variables): void
export function hack(selectors: string, template: TreeTemplate, stack: Variables): void
export function hack(element: Element, template: string, stack: Variables): void
export function hack(element: Element, template: TreeTemplate, stack: Variables): void
export function hack(doc: Document, template: string, stack: Variables): void
export function hack(doc: Document, template: TreeTemplate, stack: Variables): void
export function hack(element: string | Element | Document, template: string | TreeTemplate, stack?: Variables): void {
  const parent: Element =
    typeof element === 'string' ?
      document.querySelector(element) as Element :
    element.nodeType === 9 ? // DOCUMENT_NODE
      (element as Document).body :
      element as Element

  const temp: TreeTemplate = typeof template === 'string' ? parse(template) : template
  
  const shadow = parent.attachShadow({mode: 'open'})
  const tree = load(shadow)
  const patchTree = () => patch(tree, evaluate(temp, stack) as VirtualTree)
  reach(stack, patchTree)
  patchTree()
}

