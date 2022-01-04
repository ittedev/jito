// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { compact } from './compact.ts'
import { Variables, TreeTemplate } from '../template_engine/mod.ts'
import { ComponentElement } from './element.ts'
import { ComponentConstructor, Component, instanceOfComponent } from './types.ts'
import { Entity } from './entity.ts'

export function define(name: string, component: Component): void
export function define(name: string, html: string): void
export function define(name: string, html: string, stack: Variables): void
export function define(name: string, html: string, construct: ComponentConstructor): void
export function define(name: string, template: TreeTemplate): void
export function define(name: string, template: TreeTemplate, stack: Variables): void
export function define(name: string, template: TreeTemplate, construct: ComponentConstructor): void
export function define(name: string, template: string | TreeTemplate | Component, stack?: ComponentConstructor | Variables): void {
  const component = instanceOfComponent(template) ? template : compact(template as string | TreeTemplate, stack)
  customElements.define(name, class extends ComponentElement {
    constructor() {
      super()
      this.entity = new Entity(component, this, this.tree)
    }
    static getComponent(): Component | undefined {
      return component
    }
  })
}
