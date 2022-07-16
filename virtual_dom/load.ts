import { LinkedVirtualTree, LinkedVirtualElement } from './types.ts'

/**
 * Create a vertual tree from a dom node.
 */
export function load(el: Element | DocumentFragment): LinkedVirtualTree
{
  const tree = { el } as LinkedVirtualTree
  loadChildren(tree)
  return tree
}

function loadElement(el: Element): LinkedVirtualElement
{
  const ve = {
    tag: el.tagName.toLowerCase(),
    el
  } as LinkedVirtualElement

  loadAttr(ve)
  loadChildren(ve)

  return ve
}

function loadAttr(ve: LinkedVirtualElement)
{
  if (ve.el.hasAttributes()) {
    const attrs = {} as Record<string, string>
    ve.el.getAttributeNames().forEach(name => {
      if (name.startsWith('on')) return
      const value = ve.el.getAttribute(name) as string
      switch (name) {
        case 'class': case 'part': return ve[name] = value.split(/\s+/)
        case 'style': case 'is': return ve[name] = value
        default: return attrs[name] = value
      }
    })
    if (Object.keys(attrs).length) {
      ve.attrs = attrs
    }
  }
}

function loadChildren(tree: LinkedVirtualTree)
{
  if (tree.el.hasChildNodes()) {
    const nodeList = tree.el.childNodes
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
