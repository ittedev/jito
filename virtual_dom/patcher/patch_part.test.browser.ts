// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchPart } from './patch_part.ts'

test('patch new part', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    part: ['part-a']
  }
  patchPart(tree, newTree)
  log('patchNewPart1', tree)
  log('patchNewPart2', [...tree.el.part.values()])
})

test('patch add part', () => {
  const el = document.createElement('div')
  el.part.add('part-a')
  const tree = {
    tag: 'div',
    part: ['part-a'],
    el
  }
  const newTree = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c']
  }
  patchPart(tree, newTree)
  log('patchAddPart1', tree)
  log('patchAddPart2', [...tree.el.part.values()])
})

test('patch remove part', () => {
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const tree = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newTree = {
    tag: 'div',
    part: ['part-a', 'part-c']
  }
  patchPart(tree, newTree)
  log('patchRemovePart1', tree)
  log('patchRemovePart2', [...tree.el.part.values()])
})

test('patch remove all part', () => {
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const tree = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newTree = {
    tag: 'div'
  }
  patchPart(tree, newTree)
  log('patchRemoveAllPart1', tree)
  log('patchRemoveAllPart2', [...tree.el.part.values()])
})

test('patch set empty part', () => {
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const tree = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newTree = {
    tag: 'div',
    part: []
  }
  patchPart(tree, newTree)
  log('patchSetEmptyPart1', tree)
  log('patchSetEmptyPart2', [...tree.el.part.values()])
})

test('patch no change part', () => {
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b')
  const tree = {
    tag: 'div',
    part: ['part-a', 'part-b'],
    el
  }
  const newTree = {
    tag: 'div',
    part: ['part-a', 'part-b']
  }
  patchPart(tree, newTree)
  log('patchNoChangePart1', tree)
  log('patchNoChangePart2', [...tree.el.part.values()])
})
