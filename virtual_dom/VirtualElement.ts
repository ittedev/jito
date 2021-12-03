// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export interface VirtualElement {
  tag: string
  class?: Array<string>
  style?: Record<string, string>
  attr?: Record<string, string>
  event?: Record<string, ((event?: Event) => void)>
  children?: Array<string | VirtualElement | number>
  key?: unknown
}

export interface LinkedVirtualElement extends VirtualElement {
  children?: Array<string | LinkedVirtualElement | number>
  elm: Element
}