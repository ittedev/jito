// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component } from './component.ts'
import { compact } from './compact.ts'
import { Variables, TreeTemplate } from '../template_engine/mod.ts'

export function define(name: string, template: string | TreeTemplate | Component, stack?: Variables): void {
  if (typeof template === 'object' && 'rawAttributes' in template) {
    customElements.define(name, template as Component);
  } else {
    customElements.define(name, compact(template as string | TreeTemplate, stack));
  }
}
