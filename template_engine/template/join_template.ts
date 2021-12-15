// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

import { Template, instanceOfTemplate, Variables } from '../types.ts'

export class JoinTemplate implements Template<string> {
  constructor(
    private texts: Array<unknown | Template<unknown>>,
    separator: string = ''
  ) {
    const l = this.texts.length
    if (separator && l > 1) {
      const a = new Array(2 * l - 1)
      a.push(this.texts[0])
      for (let i = 1; i < l; i++) {
        a.push(separator)
        a.push(this.texts[i])
      }
      this.texts = a
    }
  }
  evalute(stack: Variables): string {
    return this.texts.reduce<string>((result: string, value: unknown | Template<unknown>) => {
      if (instanceOfTemplate(value)) {
        const text = value.evalute(stack)
        return result + (typeof text === 'object' ? JSON.stringify(text) : text as string)
      } else {
        return result + value
      }
    }, '')
  }
  optimize(): string | Template<string> {
    this.texts = this.texts.map(value => instanceOfTemplate(value) ? value.optimize() : value)
    if (!this.texts.some(value => instanceOfTemplate(value))) {
      return this
    } else {
      return this.texts.join('')
    }
  }
}
