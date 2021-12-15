// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, instanceOfTemplate, Variables } from '../types.ts'

export class FlagsTemplate implements Template<Array<string>> {
  constructor(
    private value: Template<unknown>
  ) {}
  static toFlags(value: unknown) {
    if (typeof value === 'string') {
      return value.split(/\s+/)
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value
      } else if (value) {
        return Object.keys(value).filter(key => (value as Record<string, unknown>)[key])
      }
    }
    return []
  }
  evalute(stack: Variables): Array<string> {
    return FlagsTemplate.toFlags(this.value.evalute(stack))
  }
  optimize(): Array<string> | Template<Array<string>> {
    const value = instanceOfTemplate(this.value) ? this.value.optimize() : this.value
    if (instanceOfTemplate(value)) {
      this.value = value
      return this
    } else {
      return FlagsTemplate.toFlags(value)
    }
  }
}
