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
