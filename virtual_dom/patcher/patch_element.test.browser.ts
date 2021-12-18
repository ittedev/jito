// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchElement } from './patch_element.ts'

test('patch change tag', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'p'
  }
  const patchedTree = patchElement(el, newEl)
  log('patchChangeTag1', patchedTree)
  log('patchChangeTag2', patchedTree.node.tagName)
})

test('patch change tag and other', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'p',
    class: ['class-a'],
    part: ['part-a'],
    style: 'color: red;',
    attr: {
      'attr-a': 'value 1'
    },
    children: [
      'Hello'
    ]
  }
  const patchedTree = patchElement(el, newEl)
  log('patchChangeTagAndOther1', patchedTree)
  log('patchChangeTagAndOther2', patchedTree.node.tagName)
  log('patchChangeTagAndOther3', [...patchedTree.node.classList.values()])
  log('patchChangeTagAndOther4', [...patchedTree.node.part.values()])
  log('patchChangeTagAndOther5', (patchedTree.node as HTMLElement).style.cssText)
  let output = ''
  for(const attr of patchedTree.node.attributes) {
    if ('class style part'.includes(attr.name)) {
      continue
    }
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchChangeTagAndOther6', output)
  log('patchChangeTagAndOther7', patchedTree.node.innerHTML)
})
