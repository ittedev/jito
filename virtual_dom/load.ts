// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { VirtualElement } from './VirtualElement.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
export function load(elm: Element): VirtualElement {
  console.log('[...elm.classList.values()]:', [...elm.classList.values()])
  return {
    tag: elm.tagName,
    elm,

    // class
    ...(elm.classList.length ? { class: [...elm.classList.values()] } : {}),

    // style
    ...(elm instanceof HTMLElement ? (styleList => {
      const style = {} as Record<string, string>
      for (let i = styleList.length; i--;) {
        style[styleList[i]] = styleList.getPropertyValue(styleList[i])
      }
      return Object.keys(style).length ? { style } : {}
    })(elm.style) : {}),
    
    // attributes
    ...(elm.hasAttributes() ? {
      attr: (attrs => {
        const attr = {} as {
          [name: string]: string | ((event?: Event) => void)
        }
        for(let i = attrs.length - 1; i >= 0; i--) {
          attr[attrs[i].name] = attrs[i].value;
        }
        return attr
      })(elm.attributes)
    } : {}),

    // children
    ...(elm.hasChildNodes() ? (nodeList => {
      const children = [] as Array<string | VirtualElement>
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
    })(elm.childNodes) : {})

    // ignore events
  }
}