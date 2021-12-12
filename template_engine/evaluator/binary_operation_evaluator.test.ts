// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableEvaluator } from './variable_evaluator.ts'
import { BinaryOperationEvaluator } from './binary_operation_evaluator.ts'

Deno.test('BinaryOperationEvaluator class: evalute: + operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('+', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(300, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: - operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('-', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(-100, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: / operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('/', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(0.5, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: % operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('%', left, right)
  const stack = [{
    x: 300,
    y: 200
  }] as Variables
  assertStrictEquals(100, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: ** operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('**', left, right)
  const stack = [{
    x: 100,
    y: 2
  }] as Variables
  assertStrictEquals(10000, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: in operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('in', left, right)
  const stack = [{
    x: 'key',
    y: { key: '' }
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: instanceof operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('instanceof', left, right)
  const stack = [{
    x: {},
    y: Object
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: < operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('<', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: < operator: equals', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('<', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: > operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: > operator: equals', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: <= operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('<=', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: <= operator: equals', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('<=', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: >= operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>=', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: >= operator: equals', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>=', left, right)
  const stack = [{
    x: 200,
    y: 200
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: == operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('==', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: != operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('!=', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: === operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('===', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: !== operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('!==', left, right)
  const stack = [{
    x: null,
    y: undefined
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: << operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('<<', left, right)
  const stack = [{
    x: 2,
    y: 1
  }] as Variables
  assertStrictEquals(4, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: >> operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>>', left, right)
  const stack = [{
    x: -2,
    y: 1
  }] as Variables
  assertStrictEquals(-1, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: >>> operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('>>>', left, right)
  const stack = [{
    x: -2,
    y: 1
  }] as Variables
  assertStrictEquals(-2 >>> 1, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: & operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('&', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0001, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: | operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('|', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0111, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: ^ operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('^', left, right)
  const stack = [{
    x: 0b0011,
    y: 0b0101
  }] as Variables
  assertStrictEquals(0b0110, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: && operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('&&', left, right)
  const stack = [{
    x: true,
    y: false
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: || operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('||', left, right)
  const stack = [{
    x: true,
    y: false
  }] as Variables
  assertStrictEquals(true, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: ?? operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator('??', left, right)
  const stack = [{
    x: 0,
    y: 100
  }] as Variables
  assertStrictEquals(0, evaluator.evalute(stack))
})

Deno.test('BinaryOperationEvaluator class: evalute: invalid operator', () => {
  const left = new VariableEvaluator('x')
  const right = new VariableEvaluator('y')
  const evaluator = new BinaryOperationEvaluator(',', left, right)
  const stack = [{
    x: 100,
    y: 200
  }] as Variables
  assertThrows(() => {
    evaluator.evalute(stack)
  }, Error, ', does not exist')
})
