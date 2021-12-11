// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { VirtualElement, LinkedVirtualElement } from '../types.ts'
import { patch } from '../patch.ts'

// TODO: add use DocumentFragment

class LinkedVirtualElementPointer {
  index = 0
  node: Node | null
  parent: LinkedVirtualElement
  children: Array<string | LinkedVirtualElement | number>
  stock: Map<unknown, LinkedVirtualElement>
  constructor(tree: LinkedVirtualElement) {
    this.stock = new Map<unknown, LinkedVirtualElement>()
    this.parent = tree
    this.node = tree.el.firstChild
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
      this.node = this.parent.el.lastChild
      if (this.node) {
        this.index--
      }
    }
  }
  add(ve: LinkedVirtualElement | string) {
    const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.el
    this.node = this.parent.el.insertBefore(node, this.node || null)
    this.next()
    return ve
  }
  replace(ve: LinkedVirtualElement | string) {
    if (typeof ve === 'string' && this.node?.nodeType === 3) {
      if ((this.node as Text).data !== ve) {
        (this.node as Text).data = ve
      }
    } else {
      const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.el
      if (this.node !== node) {
        if (typeof this.ve === 'object' && 'key' in this.ve) {
          this.stock.set(this.ve.key, this.ve)
        }
        this.parent.el.replaceChild(node, this.node as Node)
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
    this.parent.el.removeChild(node as Node)
  }
  removeAll() {
    if (this.node) {
      for (let node: Node | null = this.node; node !== null; node = node.nextSibling) {
        this.parent.el.removeChild(node)
      }
    }
  }
  has(key: unknown) {
    return this.stock.has(key)
  }
  addFromKey(key: unknown, ve: VirtualElement) {
    const tmp = this.stock.get(key) as LinkedVirtualElement
    this.stock.delete(key)
    return this.add(patch(tmp, ve))
  }
  clear() {
    this.stock.clear()
  }
  // true is match, false is stop, void is continue
  search(cond: () => boolean | void): boolean {
    console.log('search:', this.index, this.children[this.index], this.node)
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
export function patchChildren(tree: LinkedVirtualElement, newTree: VirtualElement) {
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
                return pointer.replace(patch(pointer.ve, ve))
              }
            }
          }
        }
        if (typeof pointer.ve === 'object') {
          const tmp = 'key' in pointer.ve ? { tag: ve.tag, el: document.createElement(ve.tag) } : pointer.ve
          return pointer.replace(patch(tmp, ve))
        } else {
          return pointer.add(patch({ tag: ve.tag, el: document.createElement(ve.tag) }, ve))
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
