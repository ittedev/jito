// deno-lint-ignore-file no-explicit-any
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

export function destroy(tree: LinkedVirtualRoot, useEvent = true): void
{
  if (!((tree as LinkedRealTarget).invalid && ((tree as LinkedRealTarget).invalid as any).children) && tree.el instanceof Node) {
    if (tree.children) {
      tree.children.forEach(child =>
        typeof child === 'object' &&
        destroy(child as LinkedVirtualRoot, useEvent)
      )
    }
    let el = tree.el as Node
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
  }
  if (useEvent && (tree as LinkedVirtualElement).tag) {
    tree.el.dispatchEvent(new CustomEvent(eventTypes.destroy, {
      bubbles: false
    }))
  }
  if (!((tree as LinkedRealTarget).invalid && ((tree as LinkedRealTarget).invalid as any).on)) {
    patchOn(tree, {})
  }
  if (!((tree as LinkedRealTarget).invalid && ((tree as LinkedRealTarget).invalid as any).attrs) && tree.el instanceof Element) {
    patchClass(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchPart(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchStyle(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchAttrs(tree as LinkedVirtualElement | LinkedRealElement, {})
    patchForm(tree as LinkedVirtualElement | LinkedRealElement, {})
  }
}
