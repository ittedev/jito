export const eventTypes = Symbol.for('Beako Event Types')

export interface HasAttrs {
  class?: Array<string>
  part?: Array<string>
  style?: string
  attrs?: Record<string, unknown>
  on?: Record<string, Array<EventListener>>
}

export type VirtualNode = string | VirtualElement | RealTarget | number

export interface VirtualTree {
  children?: Array<VirtualNode>
}

/**
 * @alpha
 */
export interface VirtualElement extends VirtualTree, HasAttrs {
  tag: string
  is?: string
  key?: unknown
  new?: boolean
}

export interface RealTarget extends VirtualTree, HasAttrs {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  invalid?: {
    attrs?: boolean
    on?: boolean
    children?: boolean
  }
}

export interface RealElement extends RealTarget {
  el: Element
}

export interface Linked {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
}

export type LinkedVirtualNode = string | LinkedVirtualElement | LinkedRealTarget | number

export interface LinkedVirtualRoot extends Linked {
  children?: Array<LinkedVirtualNode>
}

export interface LinkedVirtualTree extends  LinkedVirtualRoot {
  el: Element | DocumentFragment | ShadowRoot
}

/**
 * @alpha
 */
export interface LinkedVirtualElement extends LinkedVirtualRoot, HasAttrs {
  el: Element
  tag: string
  is?: string
  key?: unknown
}

export interface LinkedRealTarget extends LinkedVirtualRoot, HasAttrs {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  invalid?: {
    attrs?: boolean
    on?: boolean
    children?: boolean
  }
}

export interface LinkedRealElement extends LinkedRealTarget {
  el: Element
}
