// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualTree, VirtualElement, LinkedVirtualTree } from './types.ts'

/**
 * Clone a virtual element.
 * 
 * @param tree - A virtual tree or a virtual element.
 * @returns A cloned target.
 * 
 */
export function clone(tree: VirtualTree): VirtualTree {
  const cloneTree = {} as VirtualElement | VirtualTree
  if ('tag' in tree) {
    const cloneElement = cloneTree as VirtualElement
    const ve = tree as VirtualElement
    cloneElement.tag = ve.tag
    if ('is' in ve) {
      cloneElement.is = ve.tag
    }
    if (ve.class) {
      cloneElement.class = ve.class.slice()
    }
    if (ve.part) {
      cloneElement.part = ve.part.slice()
    }
    if ('style' in ve) {
      cloneElement.style = ve.style
    }
    if (ve.props) {
      cloneElement.props = { ...ve.props }
    }
    if (ve.on) {
      cloneElement.on = {}
      for (const type in ve.on) {
        cloneElement.on[type] = ve.on[type].slice()
      }
    }
  }
  if (tree.children) {
    cloneTree.children = tree.children.map(child => typeof child === 'object' ? clone(child) as VirtualElement : child)
  }
  if ('node' in tree) {
    (cloneTree as LinkedVirtualTree).el = (tree as LinkedVirtualTree).el
  }
  return cloneTree
}
