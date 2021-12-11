// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchClass } from './patch_class.ts'

test('patch new class', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    class: ['class-a']
  }
  patchClass(tree, newTree)
  log('patchNewClass1', tree)
  log('patchNewClass2', [...tree.el.classList.values()])
})

test('patch add class', () => {
  const el = document.createElement('div')
  el.classList.add('class-a')
  const tree = {
    tag: 'div',
    class: ['class-a'],
    el
  }
  const newTree = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c']
  }
  patchClass(tree, newTree)
  log('patchAddClass1', tree)
  log('patchAddClass2', [...tree.el.classList.values()])
})

test('patch remove class', () => {
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const tree = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newTree = {
    tag: 'div',
    class: ['class-a', 'class-c']
  }
  patchClass(tree, newTree)
  log('patchRemoveClass1', tree)
  log('patchRemoveClass2', [...tree.el.classList.values()])
})

test('patch remove all class', () => {
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const tree = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newTree = {
    tag: 'div'
  }
  patchClass(tree, newTree)
  log('patchRemoveAllClass1', tree)
  log('patchRemoveAllClass2', [...tree.el.classList.values()])
})

test('patch set empty class', () => {
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const tree = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newTree = {
    tag: 'div',
    class: []
  }
  patchClass(tree, newTree)
  log('patchSetEmptyClass1', tree)
  log('patchSetEmptyClass2', [...tree.el.classList.values()])
})

test('patch no change class', () => {
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b')
  const tree = {
    tag: 'div',
    class: ['class-a', 'class-b'],
    el
  }
  const newTree = {
    tag: 'div',
    class: ['class-a', 'class-b']
  }
  patchClass(tree, newTree)
  log('patchNoChangeClass1', tree)
  log('patchNoChangeClass2', [...tree.el.classList.values()])
})
