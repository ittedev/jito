// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export type Variables = Array<Record<string, unknown>>

export type TemplateType =
  'literal' |
  'variable' |
  'unary' |
  'binary' |
  'function' |
  'hash' |
  'join' |
  'flags' |
  'if' |
  'each' |
  'element' |
  'tree'

export interface Template {
  type: string
}

// deno-lint-ignore no-explicit-any
export function instanceOfTemplate(object: any): object is Template {
  return typeof object === 'object' && 'type' in object
}

export interface LiteralTemplate extends Template {
  type: 'literal'
  value: unknown
}

export interface VariableTemplate extends Template {
  type: 'variable'
  name: string
}

export interface UnaryTemplate extends Template {
  type: 'unary'
  operator: string,
  operand: Template
}

export interface BinaryTemplate extends Template {
  type: 'binary'
  operator: string,
  left: Template,
  right: Template
}

export interface FunctionTemplate extends Template {
  type: 'function'
  name: Template,
  params: Array<Template>
}

export interface HashTemplate extends Template {
  type: 'hash'
  object: Template,
  key: Template
}

export interface JoinTemplate extends Template {
  type: 'join'
  values: Array<unknown | Template>,
  separator: string
}

export interface FlagsTemplate extends Template {
  type: 'flags'
  value: Template
}

export interface IfTemplate extends Template {
  type: 'if'
  condition: Template,
  truthy: Template,
  falsy?: Template | undefined
}

export interface EachTemplate extends Template {
  type: 'each'
  each: string
  array: Template,
  value: Template
}

export interface ElementTemplate extends Template {
  type: 'element'
  tag: string,
  class: Array<Array<string> | Template>,
  part: Array<Array<string> | Template>,
  attr: Record<string, unknown | Template>,
  style: string | Template
  children: Array<Template | string>
}

export interface TreeTemplate extends Template {
  type: 'tree'
  children: Array<Template | string>
}

export type Evaluate = (template: Template, stack: Variables) => unknown

export type Evaluator = Record<string, Evaluate>

export const enum TokenField
{
  innerText,
  script,
  singleString,
  doubleString,
  template,
  lineComment,
  blockComment
}

export const enum TokenType {
  none = 0,
  multiOpetator,
  unaryOpetator,
  binaryOpetator,
  assignOpetator,
  crementOpetator, // ++, --
  chaining,     // .
  optional,     // ?.
  leftSquare,  // [
  rightSquare, // ]
  leftRound,   // (
  rightRound,  // )
  leftBrace,  // {
  rightBrace, // }
  leftMustache,  // {{
  rightMustache, // }}
  leftPlaceHolder,  // ${
  rightPlaceHolder,  // }
  lineComment,     // //~
  leftComment,  // /*
  rightComment,  // */
  comma,       // ,
  exclamation, // !
  question,    // ?
  colon,       // :
  singleQuote,
  doubleQuote,
  backQuote,
  spread,
  return,
  null,        // null
  undefined,   // undefined
  boolean,     // false, true
  kwyword,
  number,      // 0, 1, 2, etc.,
  string,      // "~", '~'
  word,        // x
  escape,
  partial,
  other
}

export interface Token extends Record<PropertyKey, unknown> {
  type: TokenType
  value: string
}
