// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchStyle } from './patch_style.ts'

test('patch new style', () => {
  const node = document.createElement('div')
  const el = {
    tag: 'div',
    node
  }
  const newEl = {
    tag: 'div',
    style: 'color: red;'
  }
  patchStyle(el, newEl)
  log('patchNewStyle1', el)
  log('patchNewStyle2', el.node.style.cssText)
})

test('patch add style', () => {
  const node = document.createElement('div')
  node.style.cssText = 'color: red;'
  const el = {
    tag: 'div',
    style: 'color: red;',
    node
  }
  const newEl = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;'
  }
  patchStyle(el, newEl)
  log('patchAddStyle1', el)
  log('patchAddStyle2', el.node.style.cssText)
})

test('patch remove style', () => {
  const node = document.createElement('div')
  node.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const el = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    node
  }
  const newEl = {
    tag: 'div',
    style: 'font-size: 1px; color: red;'
  }
  patchStyle(el, newEl)
  log('patchRemoveStyle1', el)
  log('patchRemoveStyle2', el.node.style.cssText)
})

test('patch remove All style', () => {
  const node = document.createElement('div')
  node.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const el = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    node
  }
  const newEl = {
    tag: 'div'
  }
  patchStyle(el, newEl)
  log('patchRemoveAllStyle1', el)
  log('patchRemoveAllStyle2', el.node.style.cssText)
})

test('patch set empty style', () => {
  const node = document.createElement('div')
  node.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const el = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    node
  }
  const newEl = {
    tag: 'div',
    style: ''
  }
  patchStyle(el, newEl)
  log('patchSetEmptyStyle1', el)
  log('patchSetEmptyStyle2', el.node.style.cssText)
})

test('patch no change style', () => {
  const node = document.createElement('div')
  node.style.cssText = 'font-size: 1px; margin: auto;'
  const el = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto;',
    node
  }
  const newEl = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto;'
  }
  patchStyle(el, newEl)
  log('patchNoChangeStyle1', el)
  log('patchNoChangeStyle2', el.node.style.cssText)
})
