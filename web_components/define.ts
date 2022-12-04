// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Main, Component, Patcher } from './types.ts'
import type { VirtualElement } from '../virtual_dom/types.ts'
import type { StateStack, TreeTemplate, HasChildrenTemplate, Template, HasAttrTemplate, GroupTemplate } from '../template_engine/types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { parse } from '../template_engine/parse.ts'
import { evaluate } from '../template_engine/evaluate.ts'
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
  let component = instanceOfComponent(template) ? template : compact(template, main)
  if (component.options.localeOnly) {
    throw Error('This componet is local only.')
  }
  customElements.define(name, class extends ComponentElement {
    constructor() {
      super()
      let tree = load(this.attachShadow(component.options))
      this._setEntity(new Entity(component, this, tree))

      if(this.innerHTML) {
        // if this is rendered from html
        let contents = getInnerContents(parse(this.innerHTML))
        contents.forEach(([name, value]) => {
          (this.entity as Entity).setAttr(name, value)
        })
      }
      this.loadAttrs()
    }
    static getComponent(): Component | undefined {
      return component
    }
  })
}

export function getInnerContents(
  template: HasChildrenTemplate
): Array<[string, Template]>
{
  let values = [] as Array<Template | string>
  let contents = [] as Array<[string, Template]>
  (template.children || [])
    .map(child => {
      if (!(typeof child === 'string')) {
        let temp = child as HasAttrTemplate
        if (temp.attrs) {
          if (temp.attrs['@as']) {
            contents.push([temp.attrs['@as'] as string, temp])
            return []
          } else if(temp.attrs.slot) {
            return [evaluate(child) as string | VirtualElement | number]
          }
        }
      }
      values.push(child)
      return []
    })
    .reduce((ary, values) => { // flatMap
      ary.push(...values)
      return ary
    }, [])
  if (values.length) {
    contents.push(['content', { type: 'group', children: values } as GroupTemplate])
  }
  return contents
}
