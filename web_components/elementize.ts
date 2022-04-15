// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  Component,
  instanceOfComponent,
  Module,
  instanceOfModule
} from './types.ts'
import { componentElementTag } from './element.ts'

export function elementize(component: Component): Element
export function elementize(module: Module): Element
export function elementize(tag: string): Element
export function elementize(component: Component | Module | string): Element
{
  if (typeof component === 'string') {
    return document.createElement(component)
  } else {
    const el = document.createElement(componentElementTag)
    const prop =
      instanceOfModule(component) && instanceOfComponent(component.default) ?
        component.default as unknown as string :
        component as unknown as string
    el.setAttribute('component', prop)

    return el
  }
}

