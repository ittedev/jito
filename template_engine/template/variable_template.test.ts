// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { VariableTemplate } from './variable_template.ts'

Deno.test('VariableTemplate class: evalute: array of a single record', () => {
  const template = new VariableTemplate('x')
  assertStrictEquals(100, template.evalute([{ x: 100, y: 200 }]))
})

Deno.test('VariableTemplate class: evalute: array of multi records', () => {
  const template = new VariableTemplate('x')
  assertStrictEquals(300, template.evalute([{ x: 100 }, { x: 300 }]))
})

Deno.test('VariableTemplate class: evalute: no match', () => {
  const template = new VariableTemplate('x')
  assertThrows(() => {
    template.evalute([{ y: 100 }, { y: 300 }])
  }, Error, 'x is not defined')
})

Deno.test('VariableTemplate class: evalute: long name', () => {
  const template = new VariableTemplate('$xxxxxyyyyy')
  assertStrictEquals(100, template.evalute([{ '$xxxxxyyyyy': 100 }]))
})

Deno.test('VariableTemplate class: evalute: object value', () => {
  const obj = {}
  const template = new VariableTemplate('x')
  assertStrictEquals(obj, template.evalute([{ 'x': obj }]))
})

Deno.test('VariableTemplate class: optimize:', () => {
  const template = new VariableTemplate('x')
  assertStrictEquals(template, template.optimize())
})

Deno.test('VariableTemplate class: toString:', () => {
  const template = new VariableTemplate('x')
  assertStrictEquals('x', template.toString())
})