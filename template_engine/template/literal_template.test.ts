// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { LiteralTemplate } from './literal_template.ts'

Deno.test('LiteralTemplate class: evalute: string value', () => {
  const template = new LiteralTemplate('hello')
  assertStrictEquals('hello', template.evalute([]))
})

Deno.test('LiteralTemplate class: evalute: number value', () => {
  const template = new LiteralTemplate(100)
  assertStrictEquals(100, template.evalute([]))
})

Deno.test('LiteralTemplate class: evalute: object value', () => {
  const obj = {}
  const template = new LiteralTemplate(obj)
  assertStrictEquals(obj, template.evalute([]))
})

Deno.test('LiteralTemplate class: optimize:', () => {
  const obj = {}
  const template = new LiteralTemplate(obj)
  assertStrictEquals(obj, template.evalute([]))
})

Deno.test('LiteralTemplate class: toString: string value', () => {
  const template = new LiteralTemplate('hello')
  assertStrictEquals('"hello"', template.toString())
})

Deno.test('LiteralTemplate class: toString: number value', () => {
  const template = new LiteralTemplate(100)
  assertStrictEquals('100', template.toString())
})