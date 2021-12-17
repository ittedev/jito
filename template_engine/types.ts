// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export type Variables = Array<Record<string, unknown>>

export const enum TemplateType {
  literal = 'literal',
  variable = 'variable',
  unary = 'unary',
  binary = 'binary',
  function = 'function',
  hash = 'hash',
  join = 'join',
  flags = 'flags',
  if = 'if',
  each = 'each',
  element = 'element',
  custom = 'custom'
}

export interface Template {
  type: TemplateType
}

export interface LiteralTemplate extends Template {
  type: TemplateType.literal
  value: unknown
}

export interface VariableTemplate extends Template {
  type: TemplateType.variable
  name: string
}

export interface UnaryTemplate extends Template {
  type: TemplateType.unary
  operator: string,
  operand: Template
}

export interface BinaryTemplate extends Template {
  type: TemplateType.binary
  operator: string,
  left: Template,
  right: Template
}

export interface FunctionTemplate extends Template {
  type: TemplateType.function
  name: Template,
  params: Array<Template>
}

export interface HashTemplate extends Template {
  type: TemplateType.hash
  object: Template,
  key: Template
}

export interface JoinTemplate extends Template {
  type: TemplateType.join
  values: Array<unknown | Template>,
  separator: string
}

export interface FlagsTemplate extends Template {
  type: TemplateType.flags
  value: Template
}

export interface IfTemplate extends Template {
  type: TemplateType.if
  condition: Template,
  truthy: Template,
  falsy?: Template | undefined
}

export interface EachTemplate extends Template {
  type: TemplateType.each
  eachVar: string
  array: Template,
  statement: Template
}

export interface ElementTemplate extends Template {
  type: TemplateType.element
  template: {
    tag: string,
    class: Array<Array<string> | Template>,
    part: Array<Array<string> | Template>,
    attr: Record<string, unknown | Template>,
    style: string | Template,
    bind: object
  }
}

export interface CustomTemplate {
  evalute: (stack: Variables) => unknown
}

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
