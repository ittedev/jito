// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { TermTemplate, Variables } from '../types.ts'
import { VariableTemplate } from './variable_template.ts'
import { FunctionTemplate } from './function_template.ts'

Deno.test('FunctionTemplate class: evalute: empty params', () => {
  const name = new VariableTemplate('x')
  const params = [] as Array<TermTemplate<unknown>>
  const template = new FunctionTemplate(name, params)
  const stack = [{
    x: () => 'hello'
  }] as Variables
  assertStrictEquals('hello', template.evalute(stack))
})

Deno.test('FunctionTemplate class: evalute: use params', () => {
  const name = new VariableTemplate('x')
  const params = [
    new VariableTemplate('y'),
    new VariableTemplate('z')
  ] as Array<TermTemplate<unknown>>
  const template = new FunctionTemplate(name, params)
  const stack = [{
    x: (y: string, z: string) => 'hello' + y + z,
    y: ' ',
    z: 'world'
  }] as Variables
  assertStrictEquals('hello world', template.evalute(stack))
})

Deno.test('FunctionTemplate class: evalute: not function', () => {
  const name = new VariableTemplate('x')
  const params = [] as Array<TermTemplate<unknown>>
  const template = new FunctionTemplate(name, params)
  assertThrows(() => {
    template.evalute([{ x: 100 }])
  }, Error, 'x is not a function')
})

Deno.test('FunctionTemplate class: optimize:', () => {
  const name = new VariableTemplate('x')
  const params = [] as Array<TermTemplate<unknown>>
  const template = new FunctionTemplate(name, params)
  assertStrictEquals(template, template.optimize())
})

Deno.test('FunctionTemplate class: toString:', () => {
  const name = new VariableTemplate('x')
  const params = [] as Array<TermTemplate<unknown>>
  const template = new FunctionTemplate(name, params)
  assertStrictEquals('x(...)', template.toString())
})
