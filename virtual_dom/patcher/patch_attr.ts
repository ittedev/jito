// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'

export function patchAttr(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentAttr = el.attr || {}
  const newAttr = newEl.attr || {}
  const currentAttrKeys = Object.keys(currentAttr)
  const newAttrKeys = Object.keys(newAttr)

  const shortageOrUpdated = newAttrKeys.filter(key =>
    !currentAttrKeys.includes(key) || currentAttr[key] !== newAttr[key]
  )
  for (const key of shortageOrUpdated) {
      el.node.setAttribute(key, newAttr[key])
  }

  const surplus = currentAttrKeys.filter(key => !newAttrKeys.includes(key))
  for (const key of surplus) {
    el.node.removeAttribute(key)
  }
  
  if (newAttrKeys.length) {
    el.attr = { ...newAttr }
  } else {
    delete el.attr
  }
}
