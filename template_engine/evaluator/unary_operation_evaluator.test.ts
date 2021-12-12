// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { Variables } from '../types.ts'
import { VariableEvaluator } from './variable_evaluator.ts'
import { UnaryOperationEvaluator } from './unary_operation_evaluator.ts'

Deno.test('UnaryOperationEvaluator class: evalute: void operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('void', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(undefined, evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: typeof operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('typeof', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals('number', evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: + operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('+', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(100, evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: - operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('-', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(-100, evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: ~ operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('~', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(~100, evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: ! operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator('!', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertStrictEquals(false, evaluator.evalute(stack))
})

Deno.test('UnaryOperationEvaluator class: evalute: invalid operator', () => {
  const operand = new VariableEvaluator('x')
  const evaluator = new UnaryOperationEvaluator(',', operand)
  const stack = [{
    x: 100
  }] as Variables
  assertThrows(() => {
    evaluator.evalute(stack)
  }, Error, ', does not exist')
})
