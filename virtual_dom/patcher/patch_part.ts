// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'

export function patchPart(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentPart = el.part || []
  const newPart = newEl.part || []

  const shortage = newPart.filter(part => !currentPart.includes(part))
  if (shortage.length) {
    el.node.part.add(...shortage)
  }

  const surplus = currentPart.filter(part => !newPart.includes(part))
  if (surplus.length) {
    el.node.part.remove(...surplus)
  }

  if (newPart.length) {
    el.part = newPart.slice()
  } else {
    delete el.part
  }
}
