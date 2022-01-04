// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualTree, LinkedVirtualTree, VirtualElement, LinkedVirtualElement } from './types.ts'

/**
 * Apply a patch to a dom node.
 * 
 * @param tree - A virtual tree linked with real tree.
 * @param newTree - A new virtual tree patch tree.
 * @returns If tag names are equal, then the patched tree, else new LinkedVirtualElement linked with new real element.
 * 
 * @alpha
 */
export function patch(tree: LinkedVirtualTree, newTree: VirtualTree): LinkedVirtualTree {
  patchChildren(tree, newTree)
  return tree
}

/**
 * Apply a patch to a dom element.
 * 
 * @param el - A virtual element linked with real element.
 * @param newEl - A new virtual element patch el.
 * @returns If tag names are equal, then the patched el, else new LinkedVirtualElement linked with new real element.
 * 
 * @alpha
 */
 export function patchElement(el: LinkedVirtualElement, newEl: VirtualElement): LinkedVirtualElement {
  // if tag is different, new element
  if (el.tag !== newEl.tag || el.is !== newEl.is) {
    return patchElement({
      tag: newEl.tag,
      node: newEl.is ? document.createElement(newEl.tag, { is : newEl.is }) : document.createElement(newEl.tag)
    }, newEl)
  }

  patchClass(el, newEl)
  patchPart(el, newEl)
  patchStyle(el, newEl)
  patchProps(el, newEl)
  patchEvent(el, newEl)
  patchChildren(el, newEl)

  if ('key' in newEl) {
    el.key = newEl.key
  } else {
    delete el.key
  }
  
  return el
}

function patchClass(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentClass = el.class || []
  const newClass = newEl.class || []

  const shortage = newClass.filter(cls => !currentClass.includes(cls))
  if (shortage.length) {
    el.node.classList.add(...shortage)
  }

  const surplus = currentClass.filter(cls => !newClass.includes(cls))
  if (surplus.length) {
    el.node.classList.remove(...surplus)
  }

  if (newClass.length) {
    el.class = newClass.slice()
  } else {
    delete el.class
  }
}

function patchPart(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentPart = el.part || []
  const newPart = newEl.part || []

  const shortage = newPart.filter(part => !currentPart.includes(part))
  if (shortage.length) {
    el.node.part.add(...shortage)
  }

  const surplus = currentPart.filter(part => !newPart.includes(part))
  if (surplus.length) {
    el.node.part.remove(...surplus)
  }

  if (newPart.length) {
    el.part = newPart.slice()
  } else {
    delete el.part
  }
}

function patchStyle(el: LinkedVirtualElement, newEl: VirtualElement) {
  if (el.node instanceof HTMLElement) {
    const style = el.style || ''
    const newStyle = newEl.style || ''

    if (style != newStyle) {
      el.node.style.cssText = newStyle
    
      if (newStyle != '') {
        el.style = newStyle
      } else {
        delete el.style
      }
    }
  }
}

function patchProps(el: LinkedVirtualElement, newEl: VirtualElement) {
  const currentAttr = el.props || {}
  const newAttr = newEl.props || {}
  const currentAttrKeys = Object.keys(currentAttr)
  const newAttrKeys = Object.keys(newAttr)

  const shortageOrUpdated = newAttrKeys.filter(key =>
    !currentAttrKeys.includes(key) || currentAttr[key] !== newAttr[key]
  )
  for (const key of shortageOrUpdated) {
    el.node.setAttribute(key, newAttr[key] as string)
  }

  const surplus = currentAttrKeys.filter(key => !newAttrKeys.includes(key))
  for (const key of surplus) {
    el.node.removeAttribute(key)
  }
  
  if (newAttrKeys.length) {
    el.props = { ...newAttr }
  } else {
    delete el.props
  }
}

// TODO: patchEvent
function patchEvent(tree: LinkedVirtualElement, newTree: VirtualElement) {
}

// TODO: add use DocumentFragment
class LinkedVirtualElementPointer {
  index = 0
  node: Node | null
  parent: LinkedVirtualTree
  children: Array<string | LinkedVirtualElement | number>
  stock: Map<unknown, LinkedVirtualElement>
  constructor(tree: LinkedVirtualTree) {
    this.stock = new Map<unknown, LinkedVirtualElement>()
    this.parent = tree
    this.node = tree.node.firstChild
    this.children = tree.children || []
  }
  get isEnd(): boolean {
    return this.index >= this.children.length
  }
  get ve(): string | LinkedVirtualElement | number {
    return this.children[this.index]
  }
  next() {
    if (typeof this.children[this.index] === 'number') {
      this.index++
    } else {
      if (this.node) {
        this.index++
        this.node = this.node.nextSibling
      }
    }
  }
  prev() {
    if (typeof this.children[this.index] === 'number') {
      this.index--
    } else if (this.node) {
      this.index--
      this.node = this.node.previousSibling
    } else {
      this.node = this.parent.node.lastChild
      if (this.node) {
        this.index--
      }
    }
  }
  add(ve: LinkedVirtualElement | string) {
    const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.node
    this.node = this.parent.node.insertBefore(node, this.node || null)
    this.next()
    return ve
  }
  replace(ve: LinkedVirtualElement | string) {
    if (typeof ve === 'string' && this.node?.nodeType === 3) {
      if ((this.node as Text).data !== ve) {
        (this.node as Text).data = ve
      }
    } else {
      const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.node
      if (this.node !== node) {
        if (typeof this.ve === 'object' && 'key' in this.ve) {
          this.stock.set(this.ve.key, this.ve)
        }
        this.parent.node.replaceChild(node, this.node as Node)
      }
    }
    this.next()
    return ve
  }
  remove() {
    if (typeof this.ve === 'object' && 'key' in this.ve) {
      this.stock.set(this.ve.key, this.ve)
    }
    const node = this.node
    this.node = node?.nextSibling || null
    this.parent.node.removeChild(node as Node)
  }
  removeAll() {
    if (this.node) {
      for (let node: Node | null = this.node; node !== null; node = node.nextSibling) {
        this.parent.node.removeChild(node)
      }
    }
  }
  has(key: unknown) {
    return this.stock.has(key)
  }
  addFromKey(key: unknown, ve: VirtualElement) {
    const tmp = this.stock.get(key) as LinkedVirtualElement
    this.stock.delete(key)
    return this.add(patchElement(tmp, ve))
  }
  clear() {
    this.stock.clear()
  }
  // true is match, false is stop, void is continue
  search(cond: () => boolean | void): boolean {
    if (this.isEnd) {
      return false
    }
    const result = cond()
    console.log('result:', result)
    if (typeof result === 'boolean') {
      return result
    } else {
      this.next()
      const result = this.search(cond)
      this.prev()
      if (result) {
        this.remove()
        this.index++
      }
      return result
    }
  }
}

// use boundary numbers algorithm
function patchChildren(tree: LinkedVirtualElement | LinkedVirtualTree, newTree: VirtualTree) {
  const newChildren = newTree.children || []
  const pointer = new LinkedVirtualElementPointer(tree)
  const numbers = newChildren.filter(ve => typeof ve === 'number').reverse() as Array<number>
  let number= numbers.pop()

  const tmp = newChildren.map(ve => {
    switch (typeof ve) {
      case 'string': {
        if (!pointer.isEnd && typeof pointer.ve === 'string') {
          return pointer.replace(ve)
        } else {
          return pointer.add(ve)
        }
      }

      case 'object': {
        if ('key' in ve) {
          if (pointer.has(ve.key)) {
            return pointer.addFromKey(ve.key, ve)
          } else {
            if (typeof pointer.ve === 'object') {
              const isMatched = pointer.search(() => {
                if (typeof pointer.ve === 'object' && ve.key === pointer.ve.key) {
                  return true
                } else if (typeof pointer.ve === 'number' && (number != undefined && pointer.ve === number)) {
                  return false
                }
              })
              if (isMatched) {
                return pointer.replace(patchElement(pointer.ve, ve))
              }
            }
          }
        }
        if (typeof pointer.ve === 'object') {
          const tmp = 'key' in pointer.ve ? { tag: ve.tag, node: document.createElement(ve.tag) } : pointer.ve
          return pointer.replace(patchElement(tmp, ve))
        } else {
          return pointer.add(patchElement({ tag: ve.tag, node: document.createElement(ve.tag) }, ve))
        }
      }

      case 'number': {
        const isMatched = pointer.search(() => {
          if (typeof pointer.ve === 'number' && ve === pointer.ve) {
            return true
          }
        })
        number = numbers.pop()
        if (isMatched) {
          pointer.next()
        }
        pointer.clear()
        return ve
      }
    }
  })

  pointer.removeAll()

  if (tmp.length) {
    tree.children = tmp
  } else {
    delete tree.children
  }
}