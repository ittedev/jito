// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export const eventTypes = Symbol.for('Beako Event Types')

export interface HasProps {
  class?: Array<string>
  part?: Array<string>
  style?: string
  props?: Record<string, unknown>
  on?: Record<string, Array<EventListener>>
}

export type VirtualNode = string | VirtualElement | RealTarget | number

export interface VirtualTree {
  children?: Array<VirtualNode>
}

export interface VirtualElement extends VirtualTree, HasProps {
  tag: string
  is?: string
  key?: unknown
  new?: boolean
}

export interface RealTarget extends VirtualTree, HasProps {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  keep?: boolean
  invalid?: {
    props?: boolean
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

export interface LinkedVirtualElement extends LinkedVirtualRoot, HasProps {
  el: Element
  tag: string
  is?: string
  key?: unknown
}

export interface LinkedRealTarget extends LinkedVirtualRoot, HasProps {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
  override?: boolean
  keep?: boolean
  invalid?: {
    props?: boolean
    on?: boolean
    children?: boolean
  }
}

export interface LinkedRealElement extends LinkedRealTarget {
  el: Element
}
