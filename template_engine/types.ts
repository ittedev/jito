// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.

export type Variables = Array<Record<string, unknown>>

export interface Evaluator<T> {
  evalute(stack: Variables): T
}

export type TemplateChild = string | Template | Evaluator<string> | Evaluator<Template> | Evaluator<Array<string | Template>>

export interface Template extends Record<PropertyKey, unknown> {
  tag: string
  class?: Array<Array<string> | Evaluator<Array<string>>>
  part?: Array<Array<string> | Evaluator<Array<string>>>
  style?: string | Evaluator<string>
  attr?: Evaluator<Record<string, unknown>>
  event?: Evaluator<Record<string, (event?: Event) => void>>
  children?: Array<TemplateChild>
  bind?: Record<string, unknown>
  key?: unknown
}

export const enum TokenField
{
  innerText,
  script,
  string,
  template
}

export const enum TokenType {
  none,
  text,
  chaining,     // .
  optional,
  leftSquare,  // [
  rightSquare, // ]
  leftRound,   // (
  rightRound,  // )
  leftBrace,  // {
  rightBrace, // }
  leftMustache,  // {{
  rightMustache, // }}
  pipe,        // |>
  comment,     // //~
  comma,       // ,
  exclamation, // !
  question,    // ?
  colon,       // :
  crement,
  assign,       // =
  spread,
  leftPlaceHolder,  // ${
  rightPlaceHolder,  // }
  null,        // null
  undefined,   // undefined
  boolean,     // false, true
  if,          // if
  else,        // else
  for,         // for
  in,          // in
  switch,      // switch
  case,        // case
  default,     // default
  include,     // include
  let,         // let
  var,         // var
  number,      // 0, 1, 2, etc.,
  string,      // "~", '~'
  operator,    // +, -, *, /, %, ==, ===, !=, !==, <, >, <=, >=, ||, &&
  word,        // x
  space,       //
  partial,     // |, ;, &, '~, "~
  other        // other
}

export interface Token extends Record<PropertyKey, unknown> {
  type: TokenType
  value: string
}
