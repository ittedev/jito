import { VirtualElement, LinkedVirtualElement } from './types.ts'

export function patchStyle(tree: LinkedVirtualElement, newTree: VirtualElement) {
  if (tree.el instanceof HTMLElement) {
    const style = tree.style || ''
    const newStyle = newTree.style || ''

    if (style != newStyle) {
      tree.el.style.cssText = newStyle
    
      if (newStyle != '') {
        tree.style = newStyle
      } else {
        delete tree.style
      }
    }
  }
}
