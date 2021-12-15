// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TokenField } from '../types.ts'
import { Lexer } from '../lexer/mod.ts'
import { innerText } from '../parser/mod.ts'

export function parseText(node: Text): Template<string> {
  return innerText(new Lexer(node.data, TokenField.innerText))
}
