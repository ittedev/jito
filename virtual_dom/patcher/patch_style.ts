// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'

export function patchStyle(el: LinkedVirtualElement, newEl: VirtualElement) {
  if (el.node instanceof HTMLElement) {
    const style = el.style || ''
    const newStyle = newEl.style || ''

    if (style != newStyle) {
      el.node.style.cssText = newStyle
    
      if (newStyle != '') {
        el.style = newStyle
      } else {
        delete el.style
      }
    }
  }
}
