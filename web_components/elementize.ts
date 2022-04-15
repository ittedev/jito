// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import type { Component } from './types.ts'
import { componentElementTag } from './element.ts'

export function elementize(component: Component): Element
export function elementize(tag: string): Element
export function elementize(component: Component | string): Element
{
  if (typeof component === 'string') {
    return document.createElement(component)
  } else {
    const el = document.createElement(componentElementTag)
    el.setAttribute('component', component as unknown as string)
    return el
  }
}

