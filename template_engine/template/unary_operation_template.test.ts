// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableTemplate } from './variable_template.ts'
import { UnaryOperationTemplate } from './unary_operation_template.ts'

Deno.test('UnaryOperationTemplate class: evalute: void operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('void', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(undefined, template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: typeof operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('typeof', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals('number', template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: + operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('+', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(100, template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: - operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('-', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(-100, template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: ~ operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('~', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(~100, template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: ! operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate('!', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('UnaryOperationTemplate class: evalute: invalid operator', () => {
  const operand = new VariableTemplate('x')
  const template = new UnaryOperationTemplate(',', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertThrows(() => {
    template.evalute(stack)
  }, Error, ', does not exist')
})
