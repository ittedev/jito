// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentOptions, Component } from './types.ts'

export function seal( component: Component, options: ComponentOptions = {} ): Component {
  component.options = Object.freeze({ mode: 'closed', ...options })
  return Object.freeze(component)
}
