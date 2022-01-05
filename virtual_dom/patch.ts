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
 * @param ve - A virtual element linked with real element.
 * @param newVe - A new virtual element patch ve.
 * @returns If tag names are equal, then the patched ve, else new LinkedVirtualElement linked with new real element.
 * 
 * @alpha
 */
 export function patchElement(ve: LinkedVirtualElement, newVe: VirtualElement): LinkedVirtualElement {
  // if tag is different, new element
  if (ve.tag !== newVe.tag || ve.is !== newVe.is) {
    return patchElement(newVe.is ? {
      tag: newVe.tag,
      is : newVe.is,
      node: document.createElement(newVe.tag, { is : newVe.is })
    } : {
      tag: newVe.tag,
      node: document.createElement(newVe.tag)
    }, newVe)
  }

  patchClass(ve, newVe)
  patchPart(ve, newVe)
  patchStyle(ve, newVe)
  patchProps(ve, newVe)
  patchOn(ve, newVe)
  patchChildren(ve, newVe)

  if ('key' in newVe) {
    ve.key = newVe.key
  } else {
    delete ve.key
  }
  
  return ve
}

function patchClass(ve: LinkedVirtualElement, newVe: VirtualElement) {
  const currentClass = ve.class || []
  const newClass = newVe.class || []

  const shortage = newClass.filter(cls => !currentClass.includes(cls))
  if (shortage.length) {
    ve.node.classList.add(...shortage)
  }

  const surplus = currentClass.filter(cls => !newClass.includes(cls))
  if (surplus.length) {
    ve.node.classList.remove(...surplus)
  }

  if (newClass.length) {
    ve.class = newClass.slice()
  } else {
    delete ve.class
  }
}

function patchPart(ve: LinkedVirtualElement, newVe: VirtualElement) {
  const currentPart = ve.part || []
  const newPart = newVe.part || []

  const shortage = newPart.filter(part => !currentPart.includes(part))
  if (shortage.length) {
    ve.node.part.add(...shortage)
  }

  const surplus = currentPart.filter(part => !newPart.includes(part))
  if (surplus.length) {
    ve.node.part.remove(...surplus)
  }

  if (newPart.length) {
    ve.part = newPart.slice()
  } else {
    delete ve.part
  }
}

function patchStyle(ve: LinkedVirtualElement, newVe: VirtualElement) {
  if (ve.node instanceof HTMLElement) {
    const style = ve.style || ''
    const newStyle = newVe.style || ''

    if (style != newStyle) {
      ve.node.style.cssText = newStyle
    
      if (newStyle != '') {
        ve.style = newStyle
      } else {
        delete ve.style
      }
    }
  }
}

function patchProps(ve: LinkedVirtualElement, newVe: VirtualElement) {
  const currentProps = ve.props || {}
  const newProps = newVe.props || {}
  const currentPropsKeys = Object.keys(currentProps)
  const newPropsKeys = Object.keys(newProps)

  // shortageOrUpdated
  newPropsKeys
    .filter(key => !currentPropsKeys.includes(key) || currentProps[key] !== newProps[key])
    .forEach(key => ve.node.setAttribute(key, newProps[key] as string))

  // surplus
  currentPropsKeys
    .filter(key => !newPropsKeys.includes(key))
    .forEach(key => ve.node.removeAttribute(key))
  
  if (newPropsKeys.length) {
    ve.props = { ...newProps }
  } else {
    delete ve.props
  }
}

function patchOn(ve: LinkedVirtualElement, newVe: VirtualElement) {
  const currentOn = ve.on || {}
  const newOn = newVe.on || {}
  const currentOnKeys = Object.keys(currentOn)
  const newOnKeys = Object.keys(newOn)

  // shortage
  newOnKeys
    .filter(type => !currentOnKeys.includes(type))
    .forEach(type => {
      newOn[type].forEach(listener => {
        ve.node.addEventListener(type, listener)
      })
    })

  // surplus
  currentOnKeys
    .filter(type => !newOnKeys.includes(type))
    .forEach(type => {
      currentOn[type].forEach(listener => {
        ve.node.removeEventListener(type, listener)
      })
    })

  // update
  newOnKeys
    .filter(type => currentOnKeys.includes(type))
    .forEach(type => {
      const news = newOn[type]
      const currents = currentOn[type]

      // shortage
      news
        .filter(listener => !currents.includes(listener))
        .forEach(listener => ve.node.addEventListener(type, listener))

      // surplus
      currents
        .filter(listener => !news.includes(listener))
        .forEach(listener => ve.node.removeEventListener(type, listener))
    })
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
    if (typeof ve === 'string' && this.node?.nodeType === 3) { // TEXT_NODE
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