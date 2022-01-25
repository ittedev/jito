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
  // console.log('patch:', JSON.parse(JSON.stringify(tree)), newTree)
  patchChildren(tree, newTree)
  tree.node.dispatchEvent(new CustomEvent(eventTypes.patch, {
    bubbles: true,
    composed: true,
    detail: {
      tree: clone(tree)
    }
  }))
  // console.log('patched:', tree)
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
export function patchElement(ve: LinkedVirtualElement | null, newVe: VirtualElement): LinkedVirtualElement {
  // if tag is different, 'is' is different or 'new' is true then new element
  if (!ve || ve.tag !== newVe.tag || ve.is !== newVe.is || newVe.new) {
    ve = newVe.is ? {
      tag: newVe.tag,
      is : newVe.is,
      node: document.createElement(newVe.tag, { is : newVe.is })
    } : {
      tag: newVe.tag,
      node: document.createElement(newVe.tag)
    }
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

class Stock {
  stock: Map<unknown, Array<LinkedVirtualElement>>
  constructor() {
    this.stock = new Map<unknown, Array<LinkedVirtualElement>>()
  }
  has(key: unknown) {
    return this.stock.get(key)?.length
  }
  push(key: unknown, value: LinkedVirtualElement) {
    if (this.stock.has(key)) {
      (this.stock.get(key) as Array<LinkedVirtualElement>).push(value)
    } else {
      this.stock.set(key, [value])
    }
  }
  // must this.has(key) === true
  shift(key: unknown): LinkedVirtualElement {
    return (this.stock.get(key) as Array<LinkedVirtualElement>).shift() as LinkedVirtualElement
  }
}

// use boundary numbers algorithm
function patchChildren(tree: LinkedVirtualElement | LinkedVirtualTree, newTree: VirtualTree) {
  const children = tree.children || []
  const newChildren = newTree.children || []
  const stock = new Stock()
  let index = 0
  let node = tree.node.firstChild as undefined | null | Node
  const numbers = newChildren.filter(vNode => typeof vNode === 'number').reverse() as Array<number>
  let number = numbers.pop()

  // replace object
  const replace = (vNode: VirtualElement) => {
    const tmp = patchElement(children[index] as LinkedVirtualElement, vNode)
    if (tmp !== children[index]) {
      destroy(children[index] as LinkedVirtualElement)
      tree.node.replaceChild(tmp.node, (children[index] as LinkedVirtualElement).node)
    }
    node = tmp.node.nextSibling
    index++
    return tmp
  }

  // add object
  const add = (vNode: VirtualElement) => {
    const tmp = patchElement(null, vNode)
    tree.node.insertBefore(tmp.node, node || null)
    return tmp
  }

  // remove node
  const remove = (useStore = false) => {
    if (typeof children[index] !== 'number') {
      if (typeof children[index] === 'object') {
        if (useStore && 'key' in (children[index] as LinkedVirtualElement)) {
          stock.push((children[index] as LinkedVirtualElement).key, children[index] as LinkedVirtualElement)
        } else {
          destroy(children[index] as LinkedVirtualElement)
        }
      }
      const old = node as Node
      node = old.nextSibling
      tree.node.removeChild(old)
    }
    index++
  }

  const tmp = newChildren.map(vNode => {
    switch (typeof vNode) {
      case 'string': {
        if (typeof children[index] === 'string') {
          // replace text
          if ((node as Text).data !== vNode) {
            (node as Text).data = vNode
          }
          node = (node as Text).nextSibling
          index++
        } else {
          // add text
          tree.node.insertBefore(document.createTextNode(vNode), node || null)
        }
        return vNode
      }

      case 'object': {

        if ('key' in vNode) {
          if (stock.has(vNode.key)) {
            const tmp = patchElement(stock.shift(vNode.key), vNode)
            tree.node.insertBefore(tmp.node, node || null)
            return tmp
          } else {
            while (index < children.length && children[index] !== number) {
              if (typeof children[index] === 'object' && vNode.key === (children[index] as LinkedVirtualElement).key) {
                // replace key object
                return replace(vNode)
              }
              remove(true)
            }
            // add key object
            return add(vNode)
          }
        } else {
          if (typeof children[index] === 'object' && !('key' in (children[index] as LinkedVirtualElement))) {
            // replace non key object
            return replace(vNode)
          } else {
            // add object
            return add(vNode)
          }
        }
      }

      case 'number': {
        while (index < children.length && children[index] !== vNode) {
          remove()
        }
        index++
        number = numbers.pop()
        stock.stock.forEach(queue => queue.forEach(ve => destroy(ve)))
        stock.stock.clear()
        return vNode
      }
    }
  })

  while (index < children.length) {
    remove()
  }

  if (tmp.length) {
    tree.children = tmp
  } else {
    delete tree.children
  }
}
