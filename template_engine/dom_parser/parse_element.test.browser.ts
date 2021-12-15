// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { parseElement } from './parse_element.ts'

test('parseElement:', () => {
  const html = `<p></p>`
  const node = new DOMParser().parseFromString(html, 'text/html').querySelector('p') as Element
  const result = parseElement(node).evalute([])
  log('parseElement', result)
})

test('parseElement: style', () => {
  const html = `<p style="color: red"></p>`
  const node = new DOMParser().parseFromString(html, 'text/html').querySelector('p') as Element
  const result = parseElement(node).evalute([])
  log('parseElementStyle', result)
})

test('parseElement: add style only', () => {
  const html = `<p style+="'color: red'"></p>`
  const node = new DOMParser().parseFromString(html, 'text/html').querySelector('p') as Element
  const result = parseElement(node).evalute([])
  log('parseElementAddStyleOnly', result)
})

test('parseElement: add style', () => {
  const html = `<p style="color: red" style+="\`margin-top: \${x + 1}px\`"></p>`
  const node = new DOMParser().parseFromString(html, 'text/html').querySelector('p') as Element
  const result = parseElement(node).evalute([{ x: 4 }])
  log('parseElementAddStyle', result)
})

test('parseElement: add styles', () => {
  const html = `<p style="color: red" style+1="'margin-top: 5px'" style+2="'margin: 0 auto'"></p>`
  const node = new DOMParser().parseFromString(html, 'text/html').querySelector('p') as Element
  const result = parseElement(node).evalute([])
  log('parseElementAddStyles', result)
})
