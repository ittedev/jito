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
 * Apply a patch to a dom tree.
 */
export function patch(
  tree: LinkedVirtualTree,
  newTree: VirtualTree
) : LinkedVirtualTree
{
  patchChildren(tree, newTree)
  tree.el.dispatchEvent(new CustomEvent(eventTypes.patch, {
    bubbles: true,
    composed: true
  }))
  return tree
}

/**
 * Apply a patch to a dom element.
 */
export function patchElement(
  ve: LinkedVirtualElement | null,
  newVe: VirtualElement
): LinkedVirtualElement
{
  // create new element
  if (
    !ve || // ve is null
    ve.tag !== newVe.tag || // tag is different
    ve.is !== newVe.is || // 'is' is different
    newVe.new // 'new' flag is true
  ) {
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

/**
 * Apply a patch to a real dom element.
 */
export function patchRealElement(
  ve: LinkedRealTarget | null,
  newVe: RealTarget
): LinkedRealTarget
{
  if (!ve || ve.el !== newVe.el) {
    ve = { el: newVe.el }
    if ('override' in newVe) {
      ve.override = newVe.override
    }
    if ('keep' in newVe) {
      ve.keep = newVe.keep
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

/**
 * Apply a patch to a dom element class attribute.
 */
export function patchClass(
  ve: LinkedVirtualElement | LinkedRealElement
  , newVe: HasProps
): void
{
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

/**
 * Apply a patch to a dom element part attribute.
 */
export function patchPart(
  ve: LinkedVirtualElement | LinkedRealElement
  , newVe: HasProps
): void
{
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

/**
 * Apply a patch to a dom element style attribute.
 */
export function patchStyle(
  ve: LinkedVirtualElement | LinkedRealElement,
  newVe: HasProps
): void
{
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

/**
 * Apply a patch to dom element attributes.
 */
export function patchProps(
  ve: LinkedVirtualElement | LinkedRealElement,
  newVe: HasProps
): void
{
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

/**
 * Apply a patch to dom element event attributes.
 */
export function patchOn(
  ve: LinkedVirtualElement | LinkedRealTarget,
  newVe: HasProps
): void
{
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

/**
 * Apply a patch to dom element form relation attributes.
 */
export function patchForm(
  ve: LinkedVirtualElement | LinkedRealElement,
  newVe: HasProps
): void
{
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

/**
 * Temporary storage when the order is changed.
 */
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

/**
 * Apply a patch to element children.
 *
 *  use boundary numbers algorithm
 */
export function patchChildren(tree: LinkedVirtualTree, newTree: VirtualTree): void
{
  const oldChildren = tree.children || []
  const newChildren = newTree.children || []
  if (oldChildren.length === 0 && newChildren.length === 0) {
    return
  }

  // If children already exists
  if (oldChildren.length === 0 && tree.el.hasChildNodes()) {
    return
  }

  // If added for the first time, then use DocumentFragment
  const parent =
    (oldChildren.length === 0 && newChildren.length > 1) ?
      new DocumentFragment() :
      tree.el

  const stock = new Stock()
  let index = 0
  let currentNode = parent.firstChild as undefined | null | Node
  const numbers =
    newChildren
      .filter(newVNode => typeof newVNode === 'number')
      .reverse() as Array<number>
  let currentNumber = numbers.pop()


  // add object
  const add = (newVNode: VirtualElement) => {
    const tmp = patchElement(null, newVNode) as LinkedVirtualElement
    parent.insertBefore(tmp.el, currentNode || null)
    return tmp
  }

  // replace object
  const replace = (newVNode: VirtualElement) => {
    const tmp = patchElement(oldChildren[index] as LinkedVirtualElement, newVNode) as LinkedVirtualElement
    if (tmp !== oldChildren[index]) {
      destroy(oldChildren[index] as LinkedVirtualElement)
      parent.replaceChild(tmp.el, (oldChildren[index] as LinkedVirtualElement).el)
    }
    currentNode = tmp.el.nextSibling
    index++
    return tmp
  }

  // remove node
  const remove = (useStore = false) => {
    if (typeof oldChildren[index] !== 'number') {
      if (typeof oldChildren[index] === 'object') {
        if (currentNode !== (oldChildren[index] as LinkedRealTarget).el) {
          destroy(oldChildren[index++] as LinkedVirtualElement)
          return
        }
        if (useStore && 'key' in (oldChildren[index] as LinkedVirtualElement)) {
          stock.push((oldChildren[index] as LinkedVirtualElement).key, oldChildren[index] as LinkedVirtualElement)
        } else {
          destroy(oldChildren[index] as LinkedVirtualElement)
        }
      }
      const old = currentNode as Node
      currentNode = old.nextSibling
      parent.removeChild(old)
    }
    index++
  }

  const tmp = newChildren.map(newVNode => {
    switch (typeof newVNode) {
      case 'string': {
        if (typeof oldChildren[index] === 'string') {
          // replace text
          if ((currentNode as Text).data !== newVNode) {
            (currentNode as Text).data = newVNode
          }
          currentNode = (currentNode as Text).nextSibling
          index++
        } else {
          // add text
          parent.insertBefore(document.createTextNode(newVNode), currentNode || null)
        }
        return newVNode
      }

      case 'object': {
        // real target
        if ('el' in newVNode) {
          if (
            typeof oldChildren[index] === 'object' &&
            newVNode.el === (oldChildren[index] as LinkedRealTarget).el
          ) {
            // patch real node
            const tmp = patchRealElement((oldChildren[index] as LinkedRealTarget), newVNode)
            if (
              !tmp.override &&
              tmp.el === currentNode &&
              tmp.el instanceof Element &&
              tmp.el.getRootNode() === currentNode.getRootNode() // Already in the same root
            ) {
              currentNode = currentNode.nextSibling
            }
            index++
            return tmp
          } else {
            // add real node
            const tmp = patchRealElement(null, newVNode)
            if (
              !tmp.override &&
              tmp.el instanceof Element && // el instanceof Element
              tmp.el.parentNode === null
            ) {
              parent.insertBefore(tmp.el, currentNode || null)
            }
            return tmp
          }
        }

        // virtual element
        if ('key' in newVNode) {
          if (stock.has(newVNode.key)) {
            const tmp = patchElement(stock.shift(newVNode.key), newVNode)
            parent.insertBefore(tmp.el, currentNode || null)
            return tmp
          } else {
            while (index < oldChildren.length && oldChildren[index] !== currentNumber) {
              if (
                typeof oldChildren[index] === 'object' &&
                newVNode.key === (oldChildren[index] as LinkedVirtualElement).key
              ) {
                // replace key object
                return replace(newVNode)
              }
              remove(true)
            }
            // add key object
            return add(newVNode)
          }
        } else {
          if (
            typeof oldChildren[index] === 'object' &&
            !('el' in newVNode) &&
            !('key' in (oldChildren[index] as LinkedVirtualElement))
          ) {
            // replace non key object
            return replace(newVNode)
          } else {
            // add object
            return add(newVNode)
          }
        }
      }

      case 'number': {
        while (index < oldChildren.length && oldChildren[index] !== newVNode) {
          remove()
        }
        index++
        currentNumber = numbers.pop()
        stock.stock.forEach(queue => queue.forEach(ve => destroy(ve)))
        stock.stock.clear()
        return newVNode
      }
    }
  })

  while (index < oldChildren.length) {
    remove()
  }

  if (tmp.length) {
    tree.children = tmp
  } else {
    delete tree.children
  }

  if (oldChildren.length === 0 && newChildren.length > 1) {
    tree.el.append(parent)
  }
}
