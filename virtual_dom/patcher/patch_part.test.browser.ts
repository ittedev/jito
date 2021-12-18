// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchPart } from './patch_part.ts'

test('patch new part', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'div',
    part: ['part-a']
  }
  patchPart(el, newEl)
  log('patchNewPart1', el)
  log('patchNewPart2', [...el.node.part.values()])
})

test('patch add part', () => {
  const node = document.createElement('div')
  node.part.add('part-a')
  const el = {
    tag: 'div',
    part: ['part-a'],
    node
  }
  const newEl = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c']
  }
  patchPart(el, newEl)
  log('patchAddPart1', el)
  log('patchAddPart2', [...el.node.part.values()])
})

test('patch remove part', () => {
  const node = document.createElement('div')
  node.part.add('part-a', 'part-b', 'part-c')
  const el = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    node
  }
  const newEl = {
    tag: 'div',
    part: ['part-a', 'part-c']
  }
  patchPart(el, newEl)
  log('patchRemovePart1', el)
  log('patchRemovePart2', [...el.node.part.values()])
})

test('patch remove all part', () => {
  const node = document.createElement('div')
  node.part.add('part-a', 'part-b', 'part-c')
  const el = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    node
  }
  const newEl = {
    tag: 'div'
  }
  patchPart(el, newEl)
  log('patchRemoveAllPart1', el)
  log('patchRemoveAllPart2', [...el.node.part.values()])
})

test('patch set empty part', () => {
  const node = document.createElement('div')
  node.part.add('part-a', 'part-b', 'part-c')
  const el = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    node
  }
  const newEl = {
    tag: 'div',
    part: []
  }
  patchPart(el, newEl)
  log('patchSetEmptyPart1', el)
  log('patchSetEmptyPart2', [...el.node.part.values()])
})

test('patch no change part', () => {
  const node = document.createElement('div')
  node.part.add('part-a', 'part-b')
  const el = {
    tag: 'div',
    part: ['part-a', 'part-b'],
    node
  }
  const newEl = {
    tag: 'div',
    part: ['part-a', 'part-b']
  }
  patchPart(el, newEl)
  log('patchNoChangePart1', el)
  log('patchNoChangePart2', [...el.node.part.values()])
})
