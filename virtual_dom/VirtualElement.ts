// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export interface VirtualElement {
  tag: string,
  class?: Array<string>,
  style?: {
    [name: string]: string
  },
  attr?: {
    [name: string]: string | ((event?: Event) => void)
  },
  children?: Array<string | VirtualElement>
  key?: unknown,
  elm?: Element
}
