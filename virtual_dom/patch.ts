// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualTree, LinkedVirtualTree, VirtualElement, LinkedVirtualElement } from './types.ts'
import { eventTypes } from './event_types.ts'
import { clone } from './clone.ts'
import { destroy } from './destroy.ts'

/**
 * Apply a patch to a dom node.
 * 
 * @param tree - A virtual tree linked with real tree.
 * @param newTree - A new virtual tree patch tree.
 * @returns If tag names are equal, then the patched tree, else new LinkedVirtualElement linked with new real element.
 * 
 */
export function patch(tree: LinkedVirtualTree, newTree: VirtualTree): LinkedVirtualTree {
  patchChildren(tree, newTree)
  tree.node.dispatchEvent(new CustomEvent(eventTypes.patch, {
    bubbles: true,
    composed: false,
    detail: {
      tree: clone(tree)
    }
  }))
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
  // if tag is different, 'is' is different or 'new' is true then new element
  if (ve.tag !== newVe.tag || ve.is !== newVe.is || newVe.new) {
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
  patchForm(ve, newVe)

  if ('key' in newVe) {
    ve.key = newVe.key
  } else {
    delete ve.key
  }
  
  return ve
}

function patchClass(ve: LinkedVirtualElement, newVe: VirtualElement) {
  const currentClass = (ve.class || []).join(' ')
  const newClass = (newVe.class || []).join(' ')

  if (currentClass !== newClass) {
    ve.node.className = newClass
  }

  if (newClass.length) {
    ve.class = (newVe.class || []).slice()
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
  if (newOnKeys.length) {
    ve.on = newOnKeys.reduce((on, type) => {
      on[type] = [...newOn[type]]
      return on
    }, {} as Record<string, Array<EventListener>>)
    // fromEntries
  } else {
    delete ve.on
  }
}

function patchForm(ve: LinkedVirtualElement, newVe: VirtualElement) {
  // <input>
  if (Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype, ve.node)) {
    const input = ve.node as HTMLInputElement
    // value
    if (input.value !== newVe.props?.value) {
      if (newVe.props && 'value' in newVe.props) {
        if (input.value !== (newVe.props?.value as string).toString()) { // Object.create(null)?
          input.value = newVe.props.value as string
        }
      } else {
        if ((ve.node as HTMLInputElement).value !== '') {
          (ve.node as HTMLInputElement).value = ''
        }
      }
    }

    // checked
    if (!input.checked && newVe.props && 'checked' in newVe.props) {
      input.checked = true
    } else if (input.checked && !(newVe.props && 'checked' in newVe.props)) {
      input.checked = false
    }
  }

  // <option>
  if (Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype, ve.node)) {
    const option = ve.node as HTMLOptionElement
    // selected
    if (!option.selected && newVe.props && 'selected' in newVe.props) {
      option.selected = true
    } else if (option.selected && !(newVe.props && 'selected' in newVe.props)) {
      option.selected = false
    }
  }
}


// TODO: add use DocumentFragment?
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
  get vNode(): string | LinkedVirtualElement | number {
    return this.children[this.index]
  }
  next(indexStep = 1) {
    if (typeof this.children[this.index] === 'number') {
      this.index += indexStep
    } else {
      if (this.node) {
        this.index += indexStep
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
  add(vNode: LinkedVirtualElement | string) {
    const node = typeof vNode === 'string' ? document.createTextNode(vNode) : vNode.node
    const next = this.node
    this.node = this.parent.node.insertBefore(node, this.node || null)
    this.next(next ? 0 : 1)
    return vNode
  }
  replace(vNode: LinkedVirtualElement | string) {
    if (typeof vNode === 'string' && this.node?.nodeType === 3) { // TEXT_NODE
      if ((this.node as Text).data !== vNode) {
        (this.node as Text).data = vNode
      }
    } else {
      const node = typeof vNode === 'string' ? document.createTextNode(vNode) : vNode.node
      if (this.node !== node) {
        if (typeof this.vNode === 'object') {
          if ('key' in this.vNode) {
            this.stock.set(this.vNode.key, this.vNode)
          } else if (this.node?.nodeType === 1) { // ELEMENT_NODE
            destroy(this.vNode)
          }
        }
        this.parent.node.replaceChild(node, this.node as Node)
        this.node = node
      }
    }
    this.next()
    return vNode
  }
  remove() {
    if (typeof this.vNode === 'object') {
      if ('key' in this.vNode) {
        this.stock.set(this.vNode.key, this.vNode)
      } if (this.node?.nodeType === 1) { // ELEMENT_NODE
        destroy(this.vNode)
      }
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
    while (!this.isEnd) {
      if (typeof this.vNode === 'object') {
        destroy(this.vNode)
      }
      this.index++
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
    this.stock.forEach(ve => destroy(ve))
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
  const numbers = newChildren.filter(vNode => typeof vNode === 'number').reverse() as Array<number>
  let number= numbers.pop()

  const tmp = newChildren.map(vNode => {
    switch (typeof vNode) {
      case 'string': {
        if (!pointer.isEnd && typeof pointer.vNode === 'string') {
          return pointer.replace(vNode)
        } else {
          return pointer.add(vNode)
        }
      }

      case 'object': {
        if ('key' in vNode) {
          if (pointer.has(vNode.key)) {
            return pointer.addFromKey(vNode.key, vNode)
          } else {
            if (typeof pointer.vNode === 'object') {
              const isMatched = pointer.search(() => {
                if (typeof pointer.vNode === 'object' && vNode.key === pointer.vNode.key) {
                  return true
                } else if (typeof pointer.vNode === 'number' && (number != undefined && pointer.vNode === number)) {
                  return false
                }
              })
              if (isMatched) {
                return pointer.replace(patchElement(pointer.vNode, vNode))
              }
            }
          }
        }
        if (typeof pointer.vNode === 'object') {
          const tmp = 'key' in pointer.vNode ? { tag: vNode.tag, node: document.createElement(vNode.tag) } : pointer.vNode
          return pointer.replace(patchElement(tmp, vNode))
        } else {
          return pointer.add(patchElement({ tag: vNode.tag, node: document.createElement(vNode.tag) }, vNode))
        }
      }

      case 'number': {
        const isMatched = pointer.search(() => {
          if (typeof pointer.vNode === 'number' && vNode === pointer.vNode) {
            return true
          }
        })
        number = numbers.pop()
        if (isMatched) {
          pointer.next()
        }
        pointer.clear()
        return vNode
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