// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableTemplate } from './variable_template.ts'
import { HashTemplate } from './hash_template.ts'

Deno.test('HashTemplate class: evalute:', () => {
  const obj = new VariableTemplate('x')
  const key = new VariableTemplate('y')
  const template = new HashTemplate(obj, key)
  const stack = [{
    x: 'hello',
    y: 1
  }] as Variables
  assertStrictEquals('e', template.evalute(stack))
})

Deno.test('HashTemplate class: toString:', () => {
  const obj = new VariableTemplate('x')
  const key = new VariableTemplate('y')
  const template = new HashTemplate(obj, key)
  assertStrictEquals('x[y]', template.toString())
})
