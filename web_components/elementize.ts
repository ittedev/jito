// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Component,
  instanceOfComponent,
  Module,
  instanceOfModule
} from './types.ts'
import { componentElementTag, ComponentElement } from './element.ts'

export async function elementize(component: Component): Promise<Element>
export async function elementize(component: Component, props: Record<string, unknown>): Promise<Element>
export async function elementize(module: Module): Promise<Element>
export async function elementize(module: Module, props: Record<string, unknown>): Promise<Element>
export async function elementize(tag: string): Promise<Element>
export async function elementize(tag: string, props: Record<string, unknown>): Promise<Element>
export async function elementize(component: Component | Module | string, props?: Record<string, unknown>): Promise<Element>
{
  // Createm Element
  let el
  if (typeof component === 'string') {
    el = document.createElement(component) as ComponentElement
  } else {
    el = document.createElement(componentElementTag) as ComponentElement
    const prop =
      instanceOfModule(component) && instanceOfComponent(component.default) ?
        component.default as unknown as string :
        component as unknown as string
    el.setAttribute('component', prop)
  }

  // Set props
  if (props) {
    for (const key in props) {
      el.setAttribute(key, props[key])
    }
  }

  // Wait runninng
  if (typeof component === 'string') {
    const El = customElements.get(component)
    if (El !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, El)) {
      await el.whenRunning()
    }
  } else {
    await el.whenRunning()
  }

  return el
}
