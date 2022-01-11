// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualTree, VirtualElement } from './types.ts'

/**
 * Find a virtual element in a virtual tree childrens.
 * 
 * @param tree - A virtual tree.
 * @param callback - A  Test function called each elemnts.
 * @returns If find virtual elements, then the first element found, else null.
 * 
 */
export function find(tree: VirtualTree, callback: (ve: VirtualElement) => boolean): VirtualElement | null {
  for (const child of tree.children || []) {
    if (typeof child === 'object') {
      if (callback(child)) {
        return child
      } else {
        find(child, callback)
      }
    }
  }
  return null
}