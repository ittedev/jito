// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableTemplate } from './variable_template.ts'
import { BinaryOperationTemplate } from './binary_operation_template.ts'

Deno.test('BinaryOperationTemplate class: evalute: + operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('+', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(300, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: - operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('-', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(-100, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: / operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('/', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(0.5, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: % operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('%', left, right)
  const stack = [{
    x: 300,
    y: 200
  }] as Variables
  assertStrictEquals(100, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: ** operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('**', left, right)
  const stack = [{
    x: 100,
    y: 2
  }] as Variables
  assertStrictEquals(10000, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: in operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('in', left, right)
  const stack = [{
    x: 'key',
    y: { key: '' }
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: instanceof operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('instanceof', left, right)
  const stack = [{
    x: {},
    y: Object
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: < operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('<', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: < operator: equals', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('<', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: > operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: > operator: equals', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: <= operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('<=', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: <= operator: equals', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('<=', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: >= operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>=', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: >= operator: equals', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>=', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: == operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('==', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: != operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('!=', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: === operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('===', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: !== operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('!==', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: << operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('<<', left, right)
  const stack = [{
    x: 2,
    y: 1
  }] as Variables
  assertStrictEquals(4, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: >> operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>>', left, right)
  const stack = [{
    x: -2,
    y: 1
  }] as Variables
  assertStrictEquals(-1, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: >>> operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('>>>', left, right)
  const stack = [{
    x: -2,
    y: 1
  }] as Variables
  assertStrictEquals(-2 >>> 1, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: & operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('&', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0001, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: | operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('|', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0111, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: ^ operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('^', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0110, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: && operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('&&', left, right)
  const stack = [{
    x: true,
    y: false
  }] as Variables
  assertStrictEquals(false, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: || operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('||', left, right)
  const stack = [{
    x: true,
    y: false
  }] as Variables
  assertStrictEquals(true, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: ?? operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate('??', left, right)
  const stack = [{
    x: 0,
    y: 100
  }] as Variables
  assertStrictEquals(0, template.evalute(stack))
})

Deno.test('BinaryOperationTemplate class: evalute: invalid operator', () => {
  const left = new VariableTemplate('x')
  const right = new VariableTemplate('y')
  const template = new BinaryOperationTemplate(',', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertThrows(() => {
    template.evalute(stack)
  }, Error, ', does not exist')
})
