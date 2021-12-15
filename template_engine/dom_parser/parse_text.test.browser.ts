// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { parseText } from './parse_text.ts'

test('parse Text Node', () => {
  const node = document.createTextNode('Hello {{ user.name }}!')
  const result = parseText(node).evalute([{ user: { name: 'beako' } }])
  log('parseText', result)
})
