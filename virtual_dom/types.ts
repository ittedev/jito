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
  events?: Record<string, Array<EventListener>>
  key?: unknown
}

export interface LinkedVirtualElement extends VirtualElement {
  node: Element
  children?: Array<string | LinkedVirtualElement | number>
}

export interface LinkedVirtualTree extends VirtualTree {
  node: Element | DocumentFragment
  children?: Array<string | LinkedVirtualElement | number>
}