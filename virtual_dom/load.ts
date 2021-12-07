// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { LinkedVirtualElement } from './types.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
export function load(el: Element): LinkedVirtualElement {
  console.log('[...el.classList.values()]:', [...el.classList.values()])
  return {
    tag: el.tagName.toLowerCase(),
    el,

    // class
    ...(el.classList.length ? { class: [...el.classList.values()] } : {}),

    // part
    ...(el.part.length ? { part: [...el.part.values()] } : {}),

    // style
    ...(el instanceof HTMLElement && el.style.length ? { style: el.style.cssText } : {}),
    
    // attributes
    ...(el.hasAttributes() ? (() => {
      const attr = {} as Record<string, string>
      el.getAttributeNames().forEach(name => {
        switch (name) {
          case 'class': case 'style': case 'part':
            return
        }
        attr[name] = el.getAttribute(name) as string
      })
      return attr.length ? { attr } : {}
    })() : {}),

    // children
    ...(el.hasChildNodes() ? (nodeList => {
      const children = [] as Array<string | LinkedVirtualElement>
      for (let i = 0; i < nodeList.length; i++) {
        switch(nodeList[i].nodeType) {
          case 3: // TEXT_NODE
            children.push((nodeList[i] as CharacterData).data)
            console.log('(nodeList[i] as CharacterData).data:', (nodeList[i] as CharacterData).data)
            break
          case 1: // ELEMENT_NODE
            children.push(load(nodeList[i] as Element))
            break
        }
      }
      return children.length ? { children } : {}
    })(el.childNodes) : {})

    // ignore events
  }
}