// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  HasProps,
  VirtualTree,
  LinkedVirtualTree,
  VirtualElement,
  LinkedRealTarget,
  LinkedRealElement,
  LinkedVirtualElement,
  RealTarget
} from './types.ts'
import { eventTypes } from './event_types.ts'
import { destroy } from './destroy.ts'

/**
 * Apply a patch to a dom node.
 *
 * @param tree - A virtual tree linked with real tree.
 * @param newTree - A new virtual tree patch tree.
 * @returns If tag names are equal, then the patched tree, else new LinkedVirtualTarget linked with new real element.
 *
 */
export function patch(tree: LinkedVirtualTree, newTree: VirtualTree): LinkedVirtualTree {
  // console.log('patch:', JSON.parse(JSON.stringify(tree)), newTree)
  patchChildren(tree, newTree)
  tree.el.dispatchEvent(new CustomEvent(eventTypes.patch, {
    bubbles: true,
    composed: true
  }))
  // console.log('patched:', tree)
  return tree
}

/**
 * Apply a patch to a dom element.
 *
 * @param ve - A virtual element linked with real element.
 * @param newVe - A new virtual element patch ve.
 * @returns If tag names are equal, then the patched ve, else new LinkedVirtualTarget linked with new real element.
 *
 * @alpha
 */
function patchElement(ve: LinkedVirtualElement | null, newVe: VirtualElement): LinkedVirtualElement {
  // if tag is different, 'is' is different or 'new' is true then new element
  if (!ve || ve.tag !== newVe.tag || ve.is !== newVe.is || newVe.new) {
    ve = newVe.is ? {
      tag: newVe.tag,
      is : newVe.is,
      el: document.createElement(newVe.tag, { is : newVe.is })
    } : {
      tag: newVe.tag,
      el: document.createElement(newVe.tag)
    }
  }

  patchClass(ve, newVe)
  patchPart(ve, newVe)
  patchStyle(ve, newVe)
  patchProps(ve, newVe)
  patchForm(ve, newVe)
  patchOn(ve, newVe)
  patchChildren(ve, newVe)

  if ('key' in newVe) {
    ve.key = newVe.key
  } else {
    delete ve.key
  }

  return ve
}

function patchRealElement(ve: LinkedRealTarget | null, newVe: RealTarget): LinkedRealTarget {
  if (!ve || ve.el !== newVe.el) {
    ve = {
      el: newVe.el
    }
    if ('insert' in newVe) {
      ve.insert = newVe.insert
    }
    if ('invalid' in newVe) {
      ve.invalid = { ...newVe.invalid }
    }
  }

  if (!ve.invalid?.props && ve.el instanceof Element) {
    patchClass(ve as LinkedRealElement, newVe)
    patchPart(ve as LinkedRealElement, newVe)
    patchStyle(ve as LinkedRealElement, newVe)
    patchProps(ve as LinkedRealElement, newVe)
    patchForm(ve as LinkedRealElement, newVe)
  }
  if (!ve.invalid?.on) {
    patchOn(ve, newVe)
  }
  if (!ve.invalid?.children && ve.el instanceof Node) {
    patchChildren(ve as LinkedVirtualTree, newVe)
  }

  return ve
}

export function patchClass(ve: LinkedVirtualElement | LinkedRealElement, newVe: HasProps) {
  const currentClass = (ve.class || []).join(' ')
  const newClass = (newVe.class || []).join(' ')

  if (currentClass !== newClass) {
    ve.el.className = newClass
  }

  if (newClass.length) {
    ve.class = (newVe.class || []).slice()
  } else {
    delete ve.class
  }
}

export function patchPart(ve: LinkedVirtualElement | LinkedRealElement, newVe: HasProps) {
  const currentPart = ve.part || []
  const newPart = newVe.part || []

  const shortage = newPart.filter(part => !currentPart.includes(part))
  if (shortage.length) {
    ve.el.part.add(...shortage)
  }

  const surplus = currentPart.filter(part => !newPart.includes(part))
  if (surplus.length) {
    ve.el.part.remove(...surplus)
  }

  if (newPart.length) {
    ve.part = newPart.slice()
  } else {
    delete ve.part
  }
}

export function patchStyle(ve: LinkedVirtualElement | LinkedRealElement, newVe: HasProps) {
  if (ve.el instanceof HTMLElement) {
    const style = ve.style || ''
    const newStyle = newVe.style || ''

    if (style != newStyle) {
      ve.el.style.cssText = newStyle

      if (newStyle != '') {
        ve.style = newStyle
      } else {
        delete ve.style
      }
    }
  }
}

export function patchProps(ve: LinkedVirtualElement | LinkedRealElement, newVe: HasProps) {
  const currentProps = ve.props || {}
  const newProps = newVe.props || {}
  const currentPropsKeys = Object.keys(currentProps)
  const newPropsKeys = Object.keys(newProps)

  // shortageOrUpdated
  newPropsKeys
    .filter(key => !currentPropsKeys.includes(key) || currentProps[key] !== newProps[key])
    .forEach(key => ve.el.setAttribute(key, newProps[key] as string))

  // surplus
  currentPropsKeys
    .filter(key => !newPropsKeys.includes(key))
    .forEach(key => ve.el.removeAttribute(key))

  if (newPropsKeys.length) {
    ve.props = { ...newProps }
  } else {
    delete ve.props
  }
}

export function patchOn(ve: LinkedVirtualElement | LinkedRealTarget, newVe: HasProps) {
  const currentOn = ve.on || {}
  const newOn = newVe.on || {}
  const currentOnKeys = Object.keys(currentOn)
  const newOnKeys = Object.keys(newOn)

  // shortage
  newOnKeys
    .filter(type => !currentOnKeys.includes(type))
    .forEach(type => {
      newOn[type].forEach(listener => {
        ve.el.addEventListener(type, listener)
      })
    })

  // surplus
  currentOnKeys
    .filter(type => !newOnKeys.includes(type))
    .forEach(type => {
      currentOn[type].forEach(listener => {
        ve.el.removeEventListener(type, listener)
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
        .forEach(listener => ve.el.addEventListener(type, listener))

      // surplus
      currents
        .filter(listener => !news.includes(listener))
        .forEach(listener => ve.el.removeEventListener(type, listener))
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

export function patchForm(ve: LinkedVirtualElement | LinkedRealElement, newVe: HasProps) {
  // <input>
  if (Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype, ve.el)) {
    const input = ve.el as HTMLInputElement
    // value
    if (input.value !== newVe.props?.value) {
      if (newVe.props && 'value' in newVe.props) {
        if (input.value !== (newVe.props?.value as string).toString()) { // Object.create(null)?
          input.value = newVe.props.value as string
        }
      } else {
        if ((ve.el as HTMLInputElement).value !== '') {
          (ve.el as HTMLInputElement).value = ''
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
  if (Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype, ve.el)) {
    const option = ve.el as HTMLOptionElement
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
function patchChildren(tree: LinkedVirtualTree, newTree: VirtualTree) {
  const children = tree.children || []
  const newChildren = newTree.children || []
  const stock = new Stock()
  let index = 0
  let node = tree.el.firstChild as undefined | null | Node
  const numbers = newChildren.filter(vNode => typeof vNode === 'number').reverse() as Array<number>
  let number = numbers.pop()

  // add object
  const add = (vNode: VirtualElement) => {
    const tmp = patchElement(null, vNode) as LinkedVirtualElement
    tree.el.insertBefore(tmp.el, node || null)
    return tmp
  }

  // replace object
  const replace = (vNode: VirtualElement) => {
    const tmp = patchElement(children[index] as LinkedVirtualElement, vNode) as LinkedVirtualElement
    if (tmp !== children[index]) {
      destroy(children[index] as LinkedVirtualElement)
      tree.el.replaceChild(tmp.el, (children[index] as LinkedVirtualElement).el)
    }
    node = tmp.el.nextSibling
    index++
    return tmp
  }

  // remove node
  const remove = (useStore = false) => {
    if (typeof children[index] !== 'number') {
      if (typeof children[index] === 'object') {
        if (node !== (children[index] as LinkedRealTarget).el) {
          index++
          return
        }
        if (useStore && 'key' in (children[index] as LinkedVirtualElement)) {
          stock.push((children[index] as LinkedVirtualElement).key, children[index] as LinkedVirtualElement)
        } else {
          destroy(children[index] as LinkedVirtualElement)
        }
      }
      const old = node as Node
      node = old.nextSibling
      tree.el.removeChild(old)
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
          tree.el.insertBefore(document.createTextNode(vNode), node || null)
        }
        return vNode
      }

      case 'object': {
        // real target
        if ('el' in vNode) {
          if (typeof children[index] === 'object' && vNode.el === (children[index] as LinkedRealTarget).el) {
            // patch real node
            const tmp = patchRealElement((children[index] as LinkedRealTarget), vNode)
            if (tmp.el === node && tmp.el instanceof Element && tmp.el.getRootNode() === node.getRootNode()) {
              node = (node as Node).nextSibling
            }
            index++
            return tmp
          } else {
            // add real node
            const tmp = patchRealElement(null, vNode) as LinkedVirtualElement
            if (tmp.el instanceof Element && tmp.el.parentNode === null) {// el instanceof Element
              tree.el.insertBefore(tmp.el, node || null)
            }
            return tmp
          }
        }

        // virtual element
        if ('key' in vNode) {
          if (stock.has(vNode.key)) {
            const tmp = patchElement(stock.shift(vNode.key), vNode) as LinkedVirtualElement
            tree.el.insertBefore(tmp.el, node || null)
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
          if (typeof children[index] === 'object' && !('el' in vNode) && !('key' in (children[index] as LinkedVirtualElement))) {
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
