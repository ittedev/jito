// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Main, Component, Patcher } from './types.ts'
import { StateStack, TreeTemplate } from '../template_engine/types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { ComponentElement } from './element.ts'
import { Entity } from './entity.ts'

export function define(name: string, component: Component): void
export function define(name: string, html: string): void
export function define(name: string, html: string, stack: StateStack): void
export function define(name: string, html: string, state: Record<string, unknown>): void
export function define(name: string, html: string, main: Main): void
export function define(name: string, template: TreeTemplate): void
export function define(name: string, template: TreeTemplate, stack: StateStack): void
export function define(name: string, template: TreeTemplate, state: Record<string, unknown>): void
export function define(name: string, template: TreeTemplate, main: Main): void
export function define(name: string, patcher: Patcher): void
export function define(name: string, patcher: Patcher, stack: StateStack): void
export function define(name: string, patcher: Patcher, state: Record<string, unknown>): void
export function define(name: string, patcher: Patcher, main: Main): void
export function define(name: string, template: string | TreeTemplate | Patcher | Component, main: StateStack | Record<string, unknown> | Main): void
export function define(
  name: string,
  template: string | TreeTemplate | Patcher | Component,
  main: StateStack | Record<string, unknown> | Main = []
): void
{
  const component = instanceOfComponent(template) ? template : compact(template, main)
  if (component.options.localeOnly) {
    throw Error('This componet is local only.')
  }
  customElements.define(name, class extends ComponentElement {
    constructor() {
      super()
      const tree = load(this.attachShadow(component.options))
      this._setEntity(new Entity(component, this, tree))

      if(this.innerHTML) {
        // if this is rendered from html
        (this.entity as Entity).setAttr('content', this.innerHTML)
        if (this.hasAttributes()) {
          this.getAttributeNames().forEach(name => {
            (this.entity as Entity).setAttr(name, this.getAttribute(name))
          })
        }
      } else {
        this.loadAttrs()
      }
    }
    static getComponent(): Component | undefined {
      return component
    }
  })
}
