// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component, instanceOfComponent } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { Entity } from './entity.ts'

export function hack(selectors: string, component: Component): void
export function hack(selectors: string, html: string): void
export function hack(selectors: string, html: string, data: Variables): void
export function hack(selectors: string, html: string, data: Record<string, unknown>): void
export function hack(selectors: string, html: string, construct: ComponentConstructor): void
export function hack(selectors: string, template: TreeTemplate): void
export function hack(selectors: string, template: TreeTemplate, data: Variables): void
export function hack(selectors: string, template: TreeTemplate, data: Record<string, unknown>): void
export function hack(selectors: string, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(element: Element, component: Component): void
export function hack(element: Element, html: string): void
export function hack(element: Element, html: string, data: Variables): void
export function hack(element: Element, html: string, data: Record<string, unknown>): void
export function hack(element: Element, html: string, construct: ComponentConstructor): void
export function hack(element: Element, template: TreeTemplate): void
export function hack(element: Element, template: TreeTemplate, data: Variables): void
export function hack(element: Element, template: TreeTemplate, data: Record<string, unknown>): void
export function hack(element: Element, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(target: string | Element, template: string | TreeTemplate | Component, data: Variables | Record<string, unknown> | ComponentConstructor): void
export function hack(target: string | Element, template: string | TreeTemplate | Component, data: Variables | Record<string, unknown> | ComponentConstructor = []): void {
  const host: Element =
    typeof target === 'string' ?
      document.querySelector(target) as Element :
      target as Element
  const component = instanceOfComponent(template) ? template : compact(template, data)
  if (component.options.localeOnly) {
    throw Error('This componet is local only.')
  }
  const tree = load(host.attachShadow(component.options))
  const entity = new Entity(component, host, tree)

  if (host.innerHTML) {
    entity.setProp('content', host.innerHTML)
  }
  if (host.hasAttributes()) {
    host.getAttributeNames().forEach(name => {
      entity.setProp(name, host.getAttribute(name))
    })
  }

  // TODO: override setAttributes
  // TODO: override innerHTML ?
}
