// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualTree, VirtualElement } from './types.ts'

/**
 * Trace virtual elements in a virtual tree childrens.
 * 
 * @param tree - A virtual tree.
 * @param callback - A function called each elemnts.
 * 
 */
export function trace(tree: VirtualTree, callback: (ve: VirtualElement) => void): void {
  tree.children?.forEach(child => {
    if (typeof child === 'object') {
      callback(child)
      trace(child, callback)
    }
  })
}
