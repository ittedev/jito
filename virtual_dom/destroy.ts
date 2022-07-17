import {
  LinkedVirtualRoot,
  LinkedVirtualElement,
  LinkedRealTarget,
  LinkedRealElement
} from './types.ts'
import { eventTypes } from './event_types.ts'
import {
  patchClass,
  patchPart,
  patchStyle,
  patchAttrs,
  patchForm,
  patchOn
} from './patch.ts'

export function destroy(tree: LinkedVirtualRoot)
{
  if (!(tree as LinkedRealTarget).invalid?.children && tree.el instanceof Node) {
    tree.children?.forEach(child =>
      typeof child === 'object' &&
      destroy(child as LinkedVirtualRoot)
    )
    let el = tree.el as Node
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
  }
  tree.el.dispatchEvent(new CustomEvent(eventTypes.destroy, {
    bubbles: false
  }))
  if (!(tree as LinkedRealTarget).invalid?.on) {
    patchOn(tree, {})
  }
  if (!(tree as LinkedRealTarget).invalid?.attrs && tree.el instanceof Element) {
    patchClass(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchPart(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchStyle(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchAttrs(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchForm(tree as LinkedVirtualElement | LinkedRealElement, {})
  }
}
