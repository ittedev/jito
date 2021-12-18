// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'
import { patchClass } from './patch_class.ts'
import { patchPart } from './patch_part.ts'
import { patchStyle } from './patch_style.ts'
import { patchAttr } from './patch_attr.ts'
import { patchEvent } from './patch_event.ts'
import { patchChildren } from './patch_children.ts'
/**
 * Apply a patch to a dom node.
 * 
 * @param el - A virtual element linked with real element.
 * @param newEl - A new virtual element patch el.
 * @returns If tag names are equal, then the patched el, else new LinkedVirtualElement linked with new real element.
 * 
 * @alpha
 */
export function patchElement(el: LinkedVirtualElement, newEl: VirtualElement): LinkedVirtualElement {
  // if tag is different, new element
  if (el.tag !== newEl.tag) {
    return patchElement({
      tag: newEl.tag,
      node: document.createElement(newEl.tag)
    }, newEl)
  }

  patchClass(el, newEl)
  patchPart(el, newEl)
  patchStyle(el, newEl)
  patchAttr(el, newEl)
  patchEvent(el, newEl)
  patchChildren(el, newEl)

  if ('key' in newEl) {
    el.key = newEl.key
  } else {
    delete el.key
  }
  
  return el
}
