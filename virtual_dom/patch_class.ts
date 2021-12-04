import { VirtualElement, LinkedVirtualElement } from './VirtualElement.ts'

export function patchClass(tree: LinkedVirtualElement, newTree: VirtualElement) {
  const currentClass = tree.class || []
  const newClass = newTree.class || []

  const shortage = newClass.filter(cls => !currentClass.includes(cls))
  if (shortage.length) {
    tree.el.classList.add(...shortage)
  }

  const surplus = currentClass.filter(cls => !newClass.includes(cls))
  if (surplus.length) {
    tree.el.classList.remove(...surplus)
  }

  if (newClass.length) {
    tree.class = newClass.slice()
  } else {
    delete tree.class
  }
}
