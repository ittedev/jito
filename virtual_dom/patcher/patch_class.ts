// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'

export function patchClass(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentClass = el.class || []
  const newClass = newEl.class || []

  const shortage = newClass.filter(cls => !currentClass.includes(cls))
  if (shortage.length) {
    el.node.classList.add(...shortage)
  }

  const surplus = currentClass.filter(cls => !newClass.includes(cls))
  if (surplus.length) {
    el.node.classList.remove(...surplus)
  }

  if (newClass.length) {
    el.class = newClass.slice()
  } else {
    delete el.class
  }
}
