// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { LinkedVirtualTree, LinkedVirtualElement } from './types.ts'
import { eventTypes } from './event_types.ts'

export function destroy(tree: LinkedVirtualTree) {
  tree.children?.forEach(child => typeof child === 'object' && destroy(child as LinkedVirtualElement))
  tree.node.dispatchEvent(new CustomEvent(eventTypes.destroy, {
    bubbles: false,
    detail: { ve: tree }
  }))
}
