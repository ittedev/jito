// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Main, Component, Patcher } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { compact } from './compact.ts'
import { ComponentElement } from './element.ts'
import { Entity } from './entity.ts'

export function define(name: string, component: Component): void
export function define(name: string, html: string): void
export function define(name: string, html: string, data: Variables): void
export function define(name: string, html: string, main: Main): void
export function define(name: string, template: TreeTemplate): void
export function define(name: string, template: TreeTemplate, data: Variables): void
export function define(name: string, template: TreeTemplate, main: Main): void
export function define(name: string, patcher: Patcher): void
export function define(name: string, patcher: Patcher, data: Variables): void
export function define(name: string, patcher: Patcher, main: Main): void
export function define(name: string, template: string | TreeTemplate | Patcher | Component, data: Variables | Record<string, unknown> | Main): void
export function define(
  name: string,
  template: string | TreeTemplate | Patcher | Component,
  data: Variables | Record<string, unknown> | Main = []
): void
{
  const component = instanceOfComponent(template) ? template : compact(template, data)
  if (component.options.localeOnly) {
    throw Error('This componet is local only.')
  }
  customElements.define(name, class extends ComponentElement {
    constructor() {
      super()
      const tree = load(this.attachShadow(component.options))
      this._setEntity(new Entity(component, this, tree))

      if(this.innerHTML) { // TODO: empty?
        // if this is rendered from html
        (this.entity as Entity).setProp('content', this.innerHTML)
        if (this.hasAttributes()) {
          this.getAttributeNames().forEach(name => {
            (this.entity as Entity).setProp(name, this.getAttribute(name))
          })
        }
      } else {
        this.loadProps()
      }
    }
    static getComponent(): Component | undefined {
      return component
    }
  })
}
