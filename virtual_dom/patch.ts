// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { VirtualElement, LinkedVirtualElement } from './VirtualElement.ts'
import { patchClass } from './patch_class.ts'
import { patchPart } from './patch_part.ts'
import { patchStyle } from './patch_style.ts'
import { patchAttr } from './patch_attr.ts'
import { patchEvent } from './patch_event.ts'


/**
 * Apply a patch to a dom node.
 * 
 * @param tree - A virtual element linked with real element.
 * @param newTree - A new virtual element patch tree.
 * @returns If tag names are equal, then the patched tree, else new LinkedVirtualElement linked with new real element.
 * 
 * @alpha
 */
export function patch(tree: LinkedVirtualElement, newTree: VirtualElement): LinkedVirtualElement {
  // if tag is different, new element
  if (tree.tag !== newTree.tag) {
    return patch({
      tag: newTree.tag,
      el: document.createElement(newTree.tag)
    }, newTree)
  }

  patchClass(tree, newTree)
  patchPart(tree, newTree)
  patchStyle(tree, newTree)
  patchAttr(tree, newTree)
  patchEvent(tree, newTree)
  
  return tree
}
