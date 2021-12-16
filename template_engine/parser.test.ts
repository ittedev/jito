// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { TokenField, TokenType, Token } from './types.ts'
import {
  Lexer
} from './lexer.ts'
import {
  innerText,
  expression
} from './parser.ts'

const stack = [{
  x: 1,
  y: 10,
  s: 's',
  h: { x: 2, y: { x: 3 }, z: [7] },
  a: [4, 5, [6], { x: 8 }],
  text: 'x'
}]

// Deno.test('empty', () => {
//   const node = expression(new Lexer('')
//   assertStrictEquals(node.evalute(stack), '')
// })

Deno.test('expression: number', () => {
  assertStrictEquals(expression(new Lexer('50.5', TokenField.script)).evalute(stack), 50.5)
})

Deno.test('expression: true', () => {
  assertStrictEquals(expression(new Lexer('true', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: string: single', () => {
  assertStrictEquals(expression(new Lexer('\'string\'', TokenField.script)).evalute(stack), 'string')
})

Deno.test('expression: string: double', () => {
  assertStrictEquals(expression(new Lexer('"string"', TokenField.script)).evalute(stack), 'string')
})

Deno.test('expression: string tenplate: string only', () => {
  assertStrictEquals(expression(new Lexer('`string`', TokenField.script)).evalute(stack), 'string')
})

Deno.test('expression: string tenplate: has expression', () => {
  assertStrictEquals(expression(new Lexer('`Hello ${text}!`', TokenField.script)).evalute(stack), 'Hello x!')
})
// TODO: test escape char
// TODO: test return

Deno.test('expression: word', () => {
  assertStrictEquals(expression(new Lexer('x', TokenField.script)).evalute(stack), 1)
  assertStrictEquals(expression(new Lexer('text', TokenField.script)).evalute(stack), 'x')
})

Deno.test('expression: hash h.x', () => {
  assertStrictEquals(expression(new Lexer('h.x', TokenField.script)).evalute(stack), 2)
})

Deno.test('expression: hash h[text]', () => {
  assertStrictEquals(expression(new Lexer('h[text]', TokenField.script)).evalute(stack), 2)
})

Deno.test('expression: hash h.y.x', () => {
  assertStrictEquals(expression(new Lexer('h.y.x', TokenField.script)).evalute(stack), 3)
})

Deno.test('expression: hash a[0]', () => {
  assertStrictEquals(expression(new Lexer('a[0]', TokenField.script)).evalute(stack), 4)
})

Deno.test('expression: hash a[2][0]', () => {
  assertStrictEquals(expression(new Lexer('a[2][0]', TokenField.script)).evalute(stack), 6)
})

Deno.test('expression: hash a[2-1]', () => {
  assertStrictEquals(expression(new Lexer('a[2-1]', TokenField.script)).evalute(stack), 5)
})

Deno.test('expression: hash h.z[0]', () => {
  assertStrictEquals(expression(new Lexer('h.z[0]', TokenField.script)).evalute(stack), 7)
})

Deno.test('expression: hash a[3].x', () => {
  assertStrictEquals(expression(new Lexer('a[3].x', TokenField.script)).evalute(stack), 8)
})

Deno.test('expression: oparate +', () => {
  assertStrictEquals(expression(new Lexer('x + 1', TokenField.script)).evalute(stack), 2)
})

Deno.test('expression: oparate -', () => {
  assertStrictEquals(expression(new Lexer('x - 2', TokenField.script)).evalute(stack), -1)
})

Deno.test('expression: oparate *', () => {
  assertStrictEquals(expression(new Lexer('x * 2', TokenField.script)).evalute(stack), 2)
})

Deno.test('expression: oparate /', () => {
  assertStrictEquals(expression(new Lexer('x / 2', TokenField.script)).evalute(stack), 0.5)
})

Deno.test('expression: oparate %', () => {
  assertStrictEquals(expression(new Lexer('y % 7', TokenField.script)).evalute(stack), 3)
})

Deno.test('expression: oparate ==', () => {
  assertStrictEquals(expression(new Lexer('x == 1', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: oparate !=', () => {
  assertStrictEquals(expression(new Lexer('x != 1', TokenField.script)).evalute(stack), false)
})

Deno.test('expression: oparate ===', () => {
  assertStrictEquals(expression(new Lexer('x === 1', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: oparate !==', () => {
  assertStrictEquals(expression(new Lexer('x !== 1', TokenField.script)).evalute(stack), false)
})

Deno.test('expression: oparate <', () => {
  assertStrictEquals(expression(new Lexer('x < 1', TokenField.script)).evalute(stack), false)
  assertStrictEquals(expression(new Lexer('x < 2', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: oparate <=', () => {
  assertStrictEquals(expression(new Lexer('x <= 1', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: oparate >', () => {
  assertStrictEquals(expression(new Lexer('x > 1', TokenField.script)).evalute(stack), false)
  assertStrictEquals(expression(new Lexer('x > -1', TokenField.script)).evalute(stack), true)
  assertStrictEquals(expression(new Lexer('x >= 1', TokenField.script)).evalute(stack), true)
  assertStrictEquals(expression(new Lexer('true || false', TokenField.script)).evalute(stack), true)
  assertStrictEquals(expression(new Lexer('true && false', TokenField.script)).evalute(stack), false)
})

Deno.test('expression: oparate >=', () => {
  assertStrictEquals(expression(new Lexer('x >= 1', TokenField.script)).evalute(stack), true)
  assertStrictEquals(expression(new Lexer('true || false', TokenField.script)).evalute(stack), true)
  assertStrictEquals(expression(new Lexer('true && false', TokenField.script)).evalute(stack), false)
})

Deno.test('expression: oparate ||', () => {
  assertStrictEquals(expression(new Lexer('true || false', TokenField.script)).evalute(stack), true)
})

Deno.test('expression: oparate &&', () => {
  assertStrictEquals(expression(new Lexer('true && false', TokenField.script)).evalute(stack), false)
})

Deno.test('expression: oparate ?:', () => {
  assertStrictEquals(expression(new Lexer('1?2:3', TokenField.script)).evalute(stack), 2)
  assertStrictEquals(expression(new Lexer('0?1:2?3:4', TokenField.script)).evalute(stack), 3)
})

Deno.test('innerText: text only', () => {
  assertStrictEquals(innerText(new Lexer('Hello world!', TokenField.innerText)).evalute(stack), 'Hello world!')
})

Deno.test('innerText: expression in text', () => {
  assertStrictEquals(innerText(new Lexer('x + 1 = {{ x + 1 }}.', TokenField.innerText)).evalute(stack), 'x + 1 = 2.')
})
