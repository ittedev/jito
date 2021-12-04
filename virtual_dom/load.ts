// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { LinkedVirtualElement } from './VirtualElement.ts'

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

    // style
    ...(el instanceof HTMLElement && el.style.length ? { style: el.style.cssText } : {}),
    
    // attributes
    ...(el.hasAttributes() ? {
      attr: (attrs => {
        const attr = {} as {
          [name: string]: string
        }
        for(let i = attrs.length - 1; i >= 0; i--) {
          attr[attrs[i].name] = attrs[i].value;
        }
        return attr
      })(el.attributes)
    } : {}),

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