import { VirtualElement, LinkedVirtualElement } from './types.ts'

export function patchPart(tree: LinkedVirtualElement, newTree: VirtualElement) {
  const currentPart = tree.part || []
  const newPart = newTree.part || []

  const shortage = newPart.filter(part => !currentPart.includes(part))
  if (shortage.length) {
    tree.el.part.add(...shortage)
  }

  const surplus = currentPart.filter(part => !newPart.includes(part))
  if (surplus.length) {
    tree.el.part.remove(...surplus)
  }

  if (newPart.length) {
    tree.part = newPart.slice()
  } else {
    delete tree.part
  }
}
