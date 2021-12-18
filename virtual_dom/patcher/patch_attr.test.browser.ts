// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchAttr } from './patch_attr.ts'

test('patch new attr', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    }
  }
  patchAttr(el, newEl)
  log('patchNewAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNewAttr2', output)
})

test('patch add attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    node
  }
  const newEl = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    }
  }
  patchAttr(el, newEl)
  log('patchAddAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchAddAttr2', output)
})

test('patch remove attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  node.setAttribute('attr-b', 'value 2')
  node.setAttribute('attr-c', 'value 3')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    node
  }
  const newEl = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-c': 'value 3'
    }
  }
  patchAttr(el, newEl)
  log('patchRemoveAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchRemoveAttr2', output)
})

test('patch remove all attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  node.setAttribute('attr-b', 'value 2')
  node.setAttribute('attr-c', 'value 3')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    node
  }
  const newEl = {
    tag: 'div'
  }
  patchAttr(el, newEl)
  log('patchRemoveAllAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchRemoveAllAttr2', output)
})

test('patch set empty attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  node.setAttribute('attr-b', 'value 2')
  node.setAttribute('attr-c', 'value 3')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    node
  }
  const newEl = {
    tag: 'div',
    attr: {}
  }
  patchAttr(el, newEl)
  log('patchSetEmptyAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchSetEmptyAttr2', output)
})

test('patch no change attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  node.setAttribute('attr-b', 'value 2')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    },
    node
  }
  const newEl = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    }
  }
  patchAttr(el, newEl)
  log('patchNoChangeAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNoChangeAttr2', output)
})

test('patch update attr', () => {
  const node = document.createElement('div')
  node.setAttribute('attr-a', 'value 1')
  const el = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    node
  }
  const newEl = {
    tag: 'div',
    attr: {
      'attr-a': 'value 2'
    }
  }
  patchAttr(el, newEl)
  log('patchUpdateAttr1', el)
  let output = ''
  for(const attr of el.node.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchUpdateAttr2', output)
})
