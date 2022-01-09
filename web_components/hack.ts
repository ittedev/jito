// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component, instanceOfComponent, CustomElementTemplate } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { VirtualElement } from '../virtual_dom/types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { Entity } from './entity.ts'
import { parse } from '../template_engine/parse.ts'
import { evaluate } from '../template_engine/evaluate.ts'

export function hack(selectors: string, component: Component): void
export function hack(selectors: string, html: string): void
export function hack(selectors: string, html: string, stack: Variables): void
export function hack(selectors: string, html: string, stack: Record<string, unknown>): void
export function hack(selectors: string, html: string, construct: ComponentConstructor): void
export function hack(selectors: string, template: TreeTemplate): void
export function hack(selectors: string, template: TreeTemplate, stack: Variables): void
export function hack(selectors: string, template: TreeTemplate, stack: Record<string, unknown>): void
export function hack(selectors: string, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(element: Element, component: Component): void
export function hack(element: Element, html: string): void
export function hack(element: Element, html: string, stack: Variables): void
export function hack(element: Element, html: string, stack: Record<string, unknown>): void
export function hack(element: Element, html: string, construct: ComponentConstructor): void
export function hack(element: Element, template: TreeTemplate): void
export function hack(element: Element, template: TreeTemplate, stack: Variables): void
export function hack(element: Element, template: TreeTemplate, stack: Record<string, unknown>): void
export function hack(element: Element, template: TreeTemplate, construct: ComponentConstructor): void
export function hack(target: string | Element, template: string | TreeTemplate | Component, stack: Variables | Record<string, unknown> | ComponentConstructor): void
export function hack(target: string | Element, template: string | TreeTemplate | Component, stack: Variables | Record<string, unknown> | ComponentConstructor = []): void {
  const element: Element =
    typeof target === 'string' ?
      document.querySelector(target) as Element :
      target as Element
  const tree = load(element.attachShadow({mode: 'open'}))
  const component = instanceOfComponent(template) ? template : compact(template, stack)
  const entity = new Entity(component, element, tree)

  const temp = parse(element) as CustomElementTemplate
  temp.type = 'custom'
  temp.isForce = true
  const ve = evaluate(temp) as VirtualElement
  for (const key in ve.props) {
    entity.setProp(key, ve.props[key])
  }

  // TODO: override setAttributes
  // TODO: override innerHTML ?
}
