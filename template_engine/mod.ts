// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export type {
  isRef,
  Variables,
  Template,
  LiteralTemplate,
  ArrayTemplate,
  ObjectTemplate,
  VariableTemplate,
  UnaryTemplate,
  BinaryTemplate,
  FunctionTemplate,
  HashTemplate,
  GetTemplate,
  JoinTemplate,
  FlagsTemplate,
  IfTemplate,
  ForTemplate,
  ElementTemplate,
  TreeTemplate,
  GroupTemplate,
  Ref,
  Evaluator,
  Evaluate,
  TokenField,
  TokenType,
  Token
} from './types.ts'

export { Lexer } from './lexer.ts'
export { innerText, expression } from './script_parser.ts'
export { Loop } from './loop.ts'
export { parse } from './parse.ts'
export { evaluate } from './evaluate.ts'
