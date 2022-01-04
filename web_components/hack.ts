// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Variables, TreeTemplate } from '../template_engine/mod.ts'
import { load } from '../virtual_dom/mod.ts'
import { compact } from './compact.ts'
import { ComponentConstructor, Component, instanceOfComponent } from './types.ts'
import { Entity } from './entity.ts'

export function hack(selectors: string, component: Component): void
export function hack(selectors: string, html: string): void
export function hack(selectors: string, html: string, stack: Variables): void
export function hack(selectors: string, html: string, construct: ComponentConstructor): void
export function hack(selectors: string, template: TreeTemplate): void
export function hack(selectors: string, template: TreeTemplate, stack: Variables): void
export function hack(selectors: string, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(element: Element, component: Component): void
export function hack(element: Element, html: string): void
export function hack(element: Element, html: string, stack: Variables): void
export function hack(element: Element, html: string, construct: ComponentConstructor): void
export function hack(element: Element, template: TreeTemplate): void
export function hack(element: Element, template: TreeTemplate, stack: Variables): void
export function hack(element: Element, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(doc: Document, component: Component): void
export function hack(doc: Document, html: string): void
export function hack(doc: Document, html: string, stack: Variables): void
export function hack(doc: Document, html: string, construct: ComponentConstructor): void
export function hack(doc: Document, template: TreeTemplate): void
export function hack(doc: Document, template: TreeTemplate, stack: Variables): void
export function hack(doc: Document, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(element: string | Element | Document, template: string | TreeTemplate | Component, stack?: ComponentConstructor | Variables): void {
  const root: Element =
    typeof element === 'string' ?
      document.querySelector(element) as Element :
    element.nodeType === 9 ? // DOCUMENT_NODE
      (element as Document).body :
      element as Element
  const tree = load(root.attachShadow({mode: 'open'}))
  const component = instanceOfComponent(template) ? template : compact(template as string | TreeTemplate, stack)
  new Entity(component, root, tree)
}
