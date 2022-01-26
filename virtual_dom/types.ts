// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export interface VirtualTree {
  children?: Array<string | VirtualElement | number>
}

export interface VirtualElement extends VirtualTree {
  tag: string
  is?: string
  class?: Array<string>
  part?: Array<string>
  style?: string
  props?: Record<string, unknown>
  on?: Record<string, Array<EventListener>>
  key?: unknown
  new?: boolean
}

export interface LinkedVirtualElement extends VirtualElement {
  el: Element
  children?: Array<string | LinkedVirtualElement | number>
}

export interface LinkedVirtualTree extends VirtualTree {
  el: Element | DocumentFragment | ShadowRoot
  children?: Array<string | LinkedVirtualElement | number>
}

export interface RemoteVirtualElement extends VirtualElement {
  el: Element | DocumentFragment | ShadowRoot | EventTarget
}
