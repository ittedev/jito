import { VirtualElement } from './VirtualElement.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
export const load = (elm: Element): VirtualElement => ({
  tag: elm.tagName,
  class: [...elm.classList.values()],
  elm,
  
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

  // style
  ...(elm instanceof HTMLElement ? {
    style: JSON.parse(JSON.stringify(elm.style))
  } : {}),

  // children
  ...(elm.hasChildNodes() ? {
    children: (nodeList => {
      const children = [] as Array<string | VirtualElement>
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
      return children
    })(elm.childNodes)
  } : {})

  // ignore events
})
