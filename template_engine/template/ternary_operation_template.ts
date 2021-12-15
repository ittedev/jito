// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, instanceOfTemplate, TermTemplate, Variables } from '../types.ts'

export class TernaryOperationTemplate implements TermTemplate<unknown> {
  constructor(
    private condition: TermTemplate<unknown>,
    private truthy: TermTemplate<unknown>,
    private falsy: TermTemplate<unknown>
  ) {}
  evalute(stack: Variables): unknown {
    return this.condition.evalute(stack) ? this.truthy.evalute(stack) : this.falsy.evalute(stack)
  }
  optimize(): unknown | Template<unknown> {
    const condition = this.condition.optimize()
    if (instanceOfTemplate(condition)) {
      const truthy = this.truthy.optimize()
      const falsy = this.falsy.optimize()
      return this
    } else {
      if (condition) {
        return this.truthy.optimize()
      } else {
        return this.falsy.optimize()
      }
    }
  }
  toString(): string {
    return '(' + this.condition.toString() + ' ? ' + this.truthy.toString() +  ' : ' + this.falsy.toString() + ')'
  }
}
