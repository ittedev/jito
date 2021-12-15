// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export type Variables = Array<Record<string, unknown>>

export interface Template<T> {
  evalute(stack: Variables): T
  optimize(): T | Template<T>
}

/**
 * Template interface for display error
 * @alpha
 */
export interface TermTemplate<T> extends Template<T> {
  toString(): string
}

// deno-lint-ignore no-explicit-any
export function instanceOfTemplate<T>(object: any): object is Template<T> {
  return typeof object === 'object' && 'evalute' in object && 'optimize' in object
}

export const enum TokenField
{
  innerText,
  script,
  singleString,
  doubleString,
  template
}

export const enum TokenType {
  none = 0,
  multiOpetator,
  unaryOpetator,
  binaryOpetator,
  assignOpetator,

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
  singleQuote,
  doubleQuote,
  backQuote,
  crement,
  spread,
  return,
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
  escape,
  partial,
  other
}

export interface Token extends Record<PropertyKey, unknown> {
  type: TokenType
  value: string
}
