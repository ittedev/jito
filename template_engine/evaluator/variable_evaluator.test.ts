// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { VariableEvaluator } from './variable_evaluator.ts'

Deno.test('VariableEvaluator class: evalute: array of a single record', () => {
  const evaluator = new VariableEvaluator('x')
  assertStrictEquals(100, evaluator.evalute([{ x: 100, y: 200 }]))
})

Deno.test('VariableEvaluator class: evalute: array of multi records', () => {
  const evaluator = new VariableEvaluator('x')
  assertStrictEquals(300, evaluator.evalute([{ x: 100 }, { x: 300 }]))
})

Deno.test('VariableEvaluator class: evalute: no match', () => {
  const evaluator = new VariableEvaluator('x')
  assertThrows(() => {
    evaluator.evalute([{ y: 100 }, { y: 300 }])
  }, Error, 'x is not defined')
})

Deno.test('VariableEvaluator class: evalute: long name', () => {
  const evaluator = new VariableEvaluator('$xxxxxyyyyy')
  assertStrictEquals(100, evaluator.evalute([{ '$xxxxxyyyyy': 100 }]))
})

Deno.test('VariableEvaluator class: evalute: object value', () => {
  const obj = {}
  const evaluator = new VariableEvaluator('x')
  assertStrictEquals(obj, evaluator.evalute([{ 'x': obj }]))
})

Deno.test('VariableEvaluator class: toString', () => {
  const obj = {}
  const evaluator = new VariableEvaluator('x')
  assertStrictEquals('x', evaluator.toString())
})