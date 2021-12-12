// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { LinkedVirtualElement } from './types.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
export function load(el: Element): LinkedVirtualElement {
  const tree = {
    tag: el.tagName.toLowerCase(),
    el
  } as LinkedVirtualElement

  // attributes
  if (el.hasAttributes()) {
    const attr = {} as Record<string, string>
    el.getAttributeNames().forEach(name => {
      // ignore events
      if (name.startsWith('on')) return
      
      const value = el.getAttribute(name) as string
      switch (name) {
        case 'class': case 'part': return tree[name] = value.split(/\s+/)
        case 'style': return tree.style = value
        default: return attr[name] = value
      }
    })
    if (Object.keys(attr).length) {
      tree.attr = attr
    }
  }

  // children
  if (el.hasChildNodes()) {
    const nodeList = el.childNodes
    const children = [] as Array<string | LinkedVirtualElement>
    for (let i = 0; i < nodeList.length; i++) {
      switch(nodeList[i].nodeType) {
        case 3: // TEXT_NODE
          children.push((nodeList[i] as CharacterData).data)
          break
        case 1: // ELEMENT_NODE
          children.push(load(nodeList[i] as Element))
          break
      }
    }
    if (children.length) {
      tree.children = children
    }
  }

  return tree
}