// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { TermEvaluator, Variables } from '../types.ts'
import { VariableEvaluator } from './variable_evaluator.ts'
import { FunctionEvaluator } from './function_evaluator.ts'

Deno.test('FunctionEvaluator class: evalute: empty params', () => {
  const name = new VariableEvaluator('x')
  const params = [] as Array<TermEvaluator<unknown>>
  const evaluator = new FunctionEvaluator(name, params)
  const stack = [{
    x: () => 'hello'
  }] as Variables
  assertStrictEquals('hello', evaluator.evalute(stack))
})

Deno.test('FunctionEvaluator class: evalute: use params', () => {
  const name = new VariableEvaluator('x')
  const params = [
    new VariableEvaluator('y'),
    new VariableEvaluator('z')
  ] as Array<TermEvaluator<unknown>>
  const evaluator = new FunctionEvaluator(name, params)
  const stack = [{
    x: (y: string, z: string) => 'hello' + y + z,
    y: ' ',
    z: 'world'
  }] as Variables
  assertStrictEquals('hello world', evaluator.evalute(stack))
})

Deno.test('FunctionEvaluator class: evalute: not function', () => {
  const name = new VariableEvaluator('x')
  const params = [] as Array<TermEvaluator<unknown>>
  const evaluator = new FunctionEvaluator(name, params)
  assertThrows(() => {
    evaluator.evalute([{ x: 100 }])
  }, Error, 'x is not a function')
})

Deno.test('FunctionEvaluator class: optimize:', () => {
  const name = new VariableEvaluator('x')
  const params = [] as Array<TermEvaluator<unknown>>
  const evaluator = new FunctionEvaluator(name, params)
  assertStrictEquals(evaluator, evaluator.optimize())
})

Deno.test('FunctionEvaluator class: toString:', () => {
  const name = new VariableEvaluator('x')
  const params = [] as Array<TermEvaluator<unknown>>
  const evaluator = new FunctionEvaluator(name, params)
  assertStrictEquals('x(...)', evaluator.toString())
})
