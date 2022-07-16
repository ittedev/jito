// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Main, Component, Patcher } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { Entity } from './entity.ts'

export function mount(selectors: string, component: Component): void
export function mount(selectors: string, html: string): void
export function mount(selectors: string, html: string, data: Variables): void
export function mount(selectors: string, html: string, data: Record<string, unknown>): void
export function mount(selectors: string, html: string, main: Main): void
export function mount(selectors: string, template: TreeTemplate): void
export function mount(selectors: string, template: TreeTemplate, data: Variables): void
export function mount(selectors: string, template: TreeTemplate, data: Record<string, unknown>): void
export function mount(selectors: string, template: TreeTemplate, main: Main): void
export function mount(selectors: string, patcher: Patcher): void
export function mount(selectors: string, patcher: Patcher, data: Variables): void
export function mount(selectors: string, patcher: Patcher, data: Record<string, unknown>): void
export function mount(selectors: string, patcher: Patcher, main: Main): void
export function mount(element: Element, component: Component): void
export function mount(element: Element, html: string): void
export function mount(element: Element, html: string, data: Variables): void
export function mount(element: Element, html: string, data: Record<string, unknown>): void
export function mount(element: Element, html: string, main: Main): void
export function mount(element: Element, template: TreeTemplate): void
export function mount(element: Element, template: TreeTemplate, data: Variables): void
export function mount(element: Element, template: TreeTemplate, data: Record<string, unknown>): void
export function mount(element: Element, template: TreeTemplate, main: Main): void
export function mount(element: Element, patcher: Patcher): void
export function mount(element: Element, patcher: Patcher, data: Variables): void
export function mount(element: Element, patcher: Patcher, data: Record<string, unknown>): void
export function mount(element: Element, patcher: Patcher, main: Main): void
export function mount(target: string | Element, template: string | TreeTemplate | Patcher | Component, data: Variables | Record<string, unknown> | Main): void
export function mount(
  target: string | Element,
  template: string | TreeTemplate | Patcher | Component,
  data: Variables | Record<string, unknown> | Main = []
): void
{
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
    entity.setAttr('content', host.innerHTML)
  }
  if (host.hasAttributes()) {
    host.getAttributeNames().forEach(name => {
      entity.setAttr(name, host.getAttribute(name))
    })
  }

  // TODO: override setAttributes
  // TODO: override innerHTML ?
}
