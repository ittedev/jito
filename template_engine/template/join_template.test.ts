// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableTemplate } from './variable_template.ts'
import { JoinTemplate } from './join_template.ts'

Deno.test('JoinTemplate class: evalute:', () => {
  const x = new VariableTemplate('x')
  const y = new VariableTemplate('y')
  const template = new JoinTemplate([x, ' ', y, ' 2 3'])
  const stack = [{
    x: 'hello',
    y: 1
  }] as Variables
  assertStrictEquals('hello 1 2 3', template.evalute(stack))
})

