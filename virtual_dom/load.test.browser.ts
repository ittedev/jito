// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../_helper/document_console.ts'
import { load } from './load.ts'

test('load body', () => {
  const doc = new DOMParser().parseFromString(`<body></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBody', vtree)
})

test('load body class', () => {
  const doc = new DOMParser().parseFromString(`<body class="class-a class-b"></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBodyClass', vtree)
})

test('load body part', () => {
  const doc = new DOMParser().parseFromString(`<body part="part-a part-b"></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBodyPart', vtree)
})

test('load single element', () => {
  const doc = new DOMParser().parseFromString(`<p></p>`, 'text/html')
  const vtree = load(doc.body)
  log('loadSingleElement', vtree)
})

test('load multi element', () => {
  const doc = new DOMParser().parseFromString(`<p></p><p></p>`, 'text/html')
  const vtree = load(doc.body)
  log('loadMultiElement', vtree)
})

test('load style element', () => {
  const doc = new DOMParser().parseFromString(`<style>a { color: red; }</style>`, 'text/html')
  console.log('textContent', doc.body.textContent)
  const vtree = load(doc)
  log('loadStyleElement', vtree)
})

test('load script element', () => {
  const doc = new DOMParser().parseFromString(`<script>console.log('hello');<\/script>`, 'text/html')
  const vtree = load(doc.body)
  log('loadScriptElement', vtree)
})
