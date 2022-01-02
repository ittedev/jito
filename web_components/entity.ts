// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentElement } from './element.ts'
import { instanceOfComponent } from './types.ts'
import { Core } from './core.ts'

export const entityTag = 'beako-entity'

class ComponentEntity extends ComponentElement {
  constructor() {
    super()
  }
  setRawAttribute(name: string, value: unknown) {
    if (name === 'component') {
      switch (typeof value) {
        case 'string': {
          const def = customElements.get(value)
          // deno-lint-ignore no-prototype-builtins
          if (def && ComponentElement.isPrototypeOf(def)) {
            const component = (def as typeof ComponentElement).getComponent()
            if (component) {
              this.core = new Core(component, this.tree)
            }
          }
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            this.core = new Core(value, this.tree)
          }
          break
      }
    }
    super.setRawAttribute(name, value)
  }
}

customElements.define(entityTag, ComponentEntity)
