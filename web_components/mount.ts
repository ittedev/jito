// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Main, Component, Patcher } from './types.ts'
import { StateStack, TreeTemplate } from '../template_engine/types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { Entity } from './entity.ts'

export function mount(selectors: string, component: Component): void
export function mount(selectors: string, html: string): void
export function mount(selectors: string, html: string, stack: StateStack): void
export function mount(selectors: string, html: string, state: Record<string, unknown>): void
export function mount(selectors: string, html: string, main: Main): void
export function mount(selectors: string, template: TreeTemplate): void
export function mount(selectors: string, template: TreeTemplate, stack: StateStack): void
export function mount(selectors: string, template: TreeTemplate, state: Record<string, unknown>): void
export function mount(selectors: string, template: TreeTemplate, main: Main): void
export function mount(selectors: string, patcher: Patcher): void
export function mount(selectors: string, patcher: Patcher, stack: StateStack): void
export function mount(selectors: string, patcher: Patcher, state: Record<string, unknown>): void
export function mount(selectors: string, patcher: Patcher, main: Main): void
export function mount(element: Element, component: Component): void
export function mount(element: Element, html: string): void
export function mount(element: Element, html: string, stack: StateStack): void
export function mount(element: Element, html: string, state: Record<string, unknown>): void
export function mount(element: Element, html: string, main: Main): void
export function mount(element: Element, template: TreeTemplate): void
export function mount(element: Element, template: TreeTemplate, stack: StateStack): void
export function mount(element: Element, template: TreeTemplate, state: Record<string, unknown>): void
export function mount(element: Element, template: TreeTemplate, main: Main): void
export function mount(element: Element, patcher: Patcher): void
export function mount(element: Element, patcher: Patcher, stack: StateStack): void
export function mount(element: Element, patcher: Patcher, state: Record<string, unknown>): void
export function mount(element: Element, patcher: Patcher, main: Main): void
export function mount(target: string | Element, template: string | TreeTemplate | Patcher | Component, main: StateStack | Record<string, unknown> | Main): void
export function mount(
  target: string | Element,
  template: string | TreeTemplate | Patcher | Component,
  main: StateStack | Record<string, unknown> | Main = []
): void
{
  const host: Element =
    typeof target === 'string' ?
      document.querySelector(target) as Element :
      target as Element
  const component = instanceOfComponent(template) ? template : compact(template, main)
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
}
