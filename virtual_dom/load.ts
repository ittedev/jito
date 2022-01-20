// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { LinkedVirtualTree, LinkedVirtualElement } from './types.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
export function load(node: Element | DocumentFragment): LinkedVirtualTree {
  const tree = { node } as LinkedVirtualTree
  loadChildren(tree)
  return tree
}

function loadElement(element: Element): LinkedVirtualElement {
  const el = {
    tag: element.tagName.toLowerCase(),
    node: element
  } as LinkedVirtualElement

  loadAttr(el)
  loadChildren(el)

  return el
}

function loadAttr(el: LinkedVirtualElement) {
  if (el.node.hasAttributes()) {
    const props = {} as Record<string, string>
    el.node.getAttributeNames().forEach(name => {
      if (name.startsWith('on')) return
      const value = el.node.getAttribute(name) as string
      switch (name) {
        case 'class': case 'part': return el[name] = value.split(/\s+/)
        case 'style': case 'is': return el[name] = value
        default: return props[name] = value
      }
    })
    if (Object.keys(props).length) {
      el.props = props
    }
  }
}

function loadChildren(tree: LinkedVirtualTree) {
  if (tree.node.hasChildNodes()) {
    const nodeList = tree.node.childNodes
    tree.children = []
    for (let i = 0; i < nodeList.length; i++) {
      switch(nodeList[i].nodeType) {
        case 1: // ELEMENT_NODE
          if ((nodeList[i] as Element).tagName === 'SCRIPT') { // skip <script>
            break
          }
          tree.children.push(loadElement(nodeList[i] as Element))
          break
        case 3: // TEXT_NODE
          tree.children.push((nodeList[i] as CharacterData).data)
          break
      }
    }
  }
}
