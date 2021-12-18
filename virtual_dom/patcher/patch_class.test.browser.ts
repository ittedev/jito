// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchClass } from './patch_class.ts'

test('patch new class', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'div',
    class: ['class-a']
  }
  patchClass(el, newEl)
  log('patchNewClass1', el)
  log('patchNewClass2', [...el.node.classList.values()])
})

test('patch add class', () => {
  const node = document.createElement('div')
  node.classList.add('class-a')
  const el = {
    tag: 'div',
    class: ['class-a'],
    node
  }
  const newEl = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c']
  }
  patchClass(el, newEl)
  log('patchAddClass1', el)
  log('patchAddClass2', [...el.node.classList.values()])
})

test('patch remove class', () => {
  const node = document.createElement('div')
  node.classList.add('class-a', 'class-b', 'class-c')
  const el = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    node
  }
  const newEl = {
    tag: 'div',
    class: ['class-a', 'class-c']
  }
  patchClass(el, newEl)
  log('patchRemoveClass1', el)
  log('patchRemoveClass2', [...el.node.classList.values()])
})

test('patch remove all class', () => {
  const node = document.createElement('div')
  node.classList.add('class-a', 'class-b', 'class-c')
  const el = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    node
  }
  const newEl = {
    tag: 'div'
  }
  patchClass(el, newEl)
  log('patchRemoveAllClass1', el)
  log('patchRemoveAllClass2', [...el.node.classList.values()])
})

test('patch set empty class', () => {
  const node = document.createElement('div')
  node.classList.add('class-a', 'class-b', 'class-c')
  const el = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    node
  }
  const newEl = {
    tag: 'div',
    class: []
  }
  patchClass(el, newEl)
  log('patchSetEmptyClass1', el)
  log('patchSetEmptyClass2', [...el.node.classList.values()])
})

test('patch no change class', () => {
  const node = document.createElement('div')
  node.classList.add('class-a', 'class-b')
  const el = {
    tag: 'div',
    class: ['class-a', 'class-b'],
    node
  }
  const newEl = {
    tag: 'div',
    class: ['class-a', 'class-b']
  }
  patchClass(el, newEl)
  log('patchNoChangeClass1', el)
  log('patchNoChangeClass2', [...el.node.classList.values()])
})
