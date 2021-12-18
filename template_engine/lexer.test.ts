// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { assertObjectMatch, assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { TokenField, TokenType, Token } from './types.ts'
import { Lexer } from './lexer.ts'

Deno.test('Lexer class: script', () => {
  const lexer = new Lexer('1+ x', TokenField.script)
  assertObjectMatch({ type: TokenType.number, value: '1' }, lexer.pop() as Token)
  assertEquals('', lexer.skip())
  assertEquals('', lexer.skip())
  assertObjectMatch({ type: TokenType.binaryOpetator, value: '+' }, lexer.pop() as Token)
  assertEquals(' ', lexer.skip())
  assertObjectMatch({ type: TokenType.word, value: 'x' }, lexer.pop() as Token)
})

Deno.test('Lexer class: innerText only', () => {
  const lexer = new Lexer('Hello { name }', TokenField.innerText)
  assertEquals('Hello { name }', lexer.skip())
})

Deno.test('Lexer class: innerText has script', () => {
  const lexer = new Lexer('Hello {{ { name } }}', TokenField.innerText)
  assertEquals('Hello ', lexer.skip())
  assertEquals('', lexer.skip())
  assertObjectMatch({ type: TokenType.leftMustache, value: '{{' }, lexer.pop() as Token)
  assertEquals(' { name } ', lexer.skip())
  assertObjectMatch({ type: TokenType.rightMustache, value: '}}' }, lexer.pop() as Token)
})
