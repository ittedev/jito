// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { LiteralEvaluator } from './literal_evaluator.ts'

Deno.test('LiteralEvaluator class: evalute: string value', () => {
  const evaluator = new LiteralEvaluator('hello')
  assertStrictEquals('hello', evaluator.evalute([]))
})

Deno.test('LiteralEvaluator class: evalute: number value', () => {
  const evaluator = new LiteralEvaluator(100)
  assertStrictEquals(100, evaluator.evalute([]))
})

Deno.test('LiteralEvaluator class: evalute: object value', () => {
  const obj = {}
  const evaluator = new LiteralEvaluator(obj)
  assertStrictEquals(obj, evaluator.evalute([]))
})

Deno.test('LiteralEvaluator class: optimize:', () => {
  const obj = {}
  const evaluator = new LiteralEvaluator(obj)
  assertStrictEquals(obj, evaluator.evalute([]))
})

Deno.test('LiteralEvaluator class: toString: string value', () => {
  const evaluator = new LiteralEvaluator('hello')
  assertStrictEquals('"hello"', evaluator.toString())
})

Deno.test('LiteralEvaluator class: toString: number value', () => {
  const evaluator = new LiteralEvaluator(100)
  assertStrictEquals('100', evaluator.toString())
})