// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  VirtualTree,
  VirtualNode
} from './types.ts'

export function concat(...trees: Array<VirtualTree | undefined>): VirtualTree
{
  const result = { children: [] as Array<VirtualNode> }
  trees.forEach(tree => {
    if (tree && tree.children) {
      result.children = result.children.concat(tree.children)
    }
  })
  return result.children.length ? result : {}
}
