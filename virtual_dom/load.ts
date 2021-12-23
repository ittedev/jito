// Copyright 2021 itte.dev. All rights reserved. MIT license.
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
    const attr = {} as Record<string, string>
    el.node.getAttributeNames().forEach(name => {
      if (name.startsWith('on')) return
      const value = el.node.getAttribute(name) as string
      switch (name) {
        case 'class': case 'part': return el[name] = value.split(/\s+/)
        case 'style': return el.style = value
        default: return attr[name] = value
      }
    })
    if (Object.keys(attr).length) {
      el.attr = attr
    }
  }
}

function loadChildren(tree: LinkedVirtualTree) {
  if (tree.node.hasChildNodes()) {
    const nodeList = tree.node.childNodes
    tree.children = []
    for (let i = 0; i < nodeList.length; i++) {
      switch(nodeList[i].nodeType) {
        case 3: // TEXT_NODE
          tree.children.push((nodeList[i] as CharacterData).data)
          break
        case 1: // ELEMENT_NODE
          tree.children.push(loadElement(nodeList[i] as Element))
          break
        // TODO: default:
      }
    }
  }
}
