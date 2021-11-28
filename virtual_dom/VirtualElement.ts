// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export interface VirtualElement {
  tag: string,
  class?: Array<string>,
  style?: Record<string, string>,
  attr?: Record<string, string | ((event?: Event) => void)>,
  children?: Array<string | VirtualElement>
  key?: unknown,
  elm?: Element
}
