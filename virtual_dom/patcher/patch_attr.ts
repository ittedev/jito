// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'

export function patchAttr(tree: LinkedVirtualElement, newTree: VirtualElement) {
  const currentAttr = tree.attr || {}
  const newAttr = newTree.attr || {}
  const currentAttrKeys = Object.keys(currentAttr)
  const newAttrKeys = Object.keys(newAttr)

  const shortageOrUpdated = newAttrKeys.filter(key =>
    !currentAttrKeys.includes(key) || currentAttr[key] !== newAttr[key]
  )
  for (const key of shortageOrUpdated) {
      tree.el.setAttribute(key, newAttr[key])
  }

  const surplus = currentAttrKeys.filter(key => !newAttrKeys.includes(key))
  for (const key of surplus) {
    tree.el.removeAttribute(key)
  }
  
  if (newAttrKeys.length) {
    tree.attr = { ...newAttr }
  } else {
    delete tree.attr
  }
}
