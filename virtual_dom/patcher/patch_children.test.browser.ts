// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { test, log } from '../../_helper/document_console.ts'
import { patchChildren } from './patch_children.ts'
import { VirtualElement } from '../types.ts'

test('patch new text', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: ['Hello']
  }
  patchChildren(tree, newTree)
  log('patchNewText1', tree)
  log('patchNewText2', tree.node.innerHTML)
})

test('patch new multi texts', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: ['Hello', 'world', '!']
  }
  patchChildren(tree, newTree)
  log('patchNewMultiText1', tree)
  log('patchNewMultiText2', tree.node.innerHTML)
})


test('test: patch update text', () => {
  const node = document.createElement('div')
  node.innerHTML = 'Hello'
  const tree = {
    tag: 'div',
    children: ['Hello'],
    node
  }
  const newTree = {
    tag: 'div',
    children: ['World'],
    node
  }
  patchChildren(tree, newTree)
  log('patchUpdateText1', tree)
  log('patchUpdateText2', tree.node.innerHTML)
})


test('patch new Element', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewEl1', tree)
  log('patchNewEl2', tree.node.firstElementChild?.tagName)
})

test('patch new multi Elements', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' },
      { tag: 'h2' },
      { tag: 'p' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewMultiEl1', tree)
  log('patchNewMultiEl2', tree.node.children[0].tagName)
  log('patchNewMultiEl3', tree.node.children[1].tagName)
  log('patchNewMultiEl4', tree.node.children[2].tagName)
})

test('patch update Element', () => {
  const node = document.createElement('div')
  const p = document.createElement('p')
  node.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', node: p }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p', class: ['class-a'] }
    ]
  }
  patchChildren(tree, newTree)
  log('patchUpdateEl1', tree)
  log('patchUpdateEl2', tree.node.firstElementChild?.tagName)
  log('patchUpdateEl3', tree.node.firstElementChild?.classList.length)
  log('patchUpdateEl4', tree.node.firstElementChild === p)
})

test('patch change Element', () => {
  const node = document.createElement('div')
  const p = document.createElement('p')
  node.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', node: p }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeEl1', tree)
  log('patchChangeEl2', tree.node.firstElementChild?.tagName)
  log('patchChangeEl3', tree.node.firstElementChild === p)
})

test('patch new Number', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      0
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewNumber1', tree)
  log('patchNewNumber2', tree.node.childElementCount)
})

test('patch new multi Numbers', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      100, 1, 0
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewMultiNumber1', tree)
  log('patchNewMultiNumber2', tree.node.childElementCount)
})

test('patch new cross Nodes', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello',
      { tag: 'br' },
      'world',
      '!',
      10,
      { tag: 'span' },
      { tag: 'a' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewCrossNode1', tree)
  log('patchNewCrossNode2', tree.node.innerHTML)
  log('patchNewCrossNode3', tree.node.children[0].tagName)
  log('patchNewCrossNode4', tree.node.children[1].tagName)
  log('patchNewCrossNode5', tree.node.children[2].tagName)
})

test('patch change text to Element', () => {
  const node = document.createElement('div')
  const tree = {
    tag: 'div',
    children: [
      'Hello'
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeTextToEl1', tree)
  log('patchChangeTextToEl2', tree.node.firstElementChild?.tagName)
  log('patchChangeTextToEl3', tree.node.childNodes.length)
})

test('patch change Element to text', () => {
  const node = document.createElement('div')
  const p = document.createElement('p')
  node.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', node: p }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello'
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeElToText1', tree)
  log('patchChangeElToText2', tree.node.innerHTML)
  log('patchChangeElToText3', tree.node.childNodes.length)
})

test('patch add text to texts', () => {
  const node = document.createElement('div')
  node.insertAdjacentText('beforeend', 'Hello')
  node.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      '!'
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello',
      'World',
      '!'
    ]
  }
  patchChildren(tree, newTree)
  log('patchAddTextToText1', tree)
  log('patchAddTextToText2', tree.node.innerHTML)
  log('patchAddTextToText3', tree.node.childNodes.length)
})

test('patch add text to Elements', () => {
  const node = document.createElement('div')
  const h1 = document.createElement('h1')
  node.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  node.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', node: h1 },
      { tag: 'h2', node: h2 }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' },
      'World',
      { tag: 'h2' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchAddTextToEl1', tree)
  log('patchAddTextToEl2', tree.node.innerHTML)
  log('patchAddTextToEl3', tree.node.childNodes.length)
  log('patchAddTextToEl4', (tree.node.childNodes[0] as Element).tagName)
  log('patchAddTextToEl5', (tree.node.childNodes[2] as Element).tagName)
})

test('patch add Element to texts', () => {
  const node = document.createElement('div')
  node.insertAdjacentText('beforeend', 'Hello')
  node.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      '!'
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello',
      { tag: 'span' },
      '!'
    ]
  }
  patchChildren(tree, newTree)
  log('patchAddElToText1', tree)
  log('patchAddElToText2', tree.node.innerHTML)
  log('patchAddElToText3', tree.node.childNodes.length)
  log('patchAddElToText4', (tree.node.childNodes[1] as Element).tagName)
})

test('patch add Element to Elements', () => {
  const node = document.createElement('div')
  const h1 = document.createElement('h1')
  node.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  node.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', node: h1 },
      { tag: 'h2', node: h2 }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' },
      { tag: 'p' },
      { tag: 'h2' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchAddElToEl1', tree)
  log('patchAddElToEl2', (tree.node.childNodes[0] as Element).tagName)
  log('patchAddElToEl3', (tree.node.childNodes[1] as Element).tagName)
  log('patchAddElToEl4', (tree.node.childNodes[2] as Element).tagName)
})

test('patch remove text', () => {
  const node = document.createElement('div')
  node.insertAdjacentText('beforeend', 'Hello')
  node.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      'World',
      '!'
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello',
      '!'
    ]
  }
  patchChildren(tree, newTree)
  log('patchRemoveText1', tree)
  log('patchRemoveText2', tree.node.innerHTML)
  log('patchRemoveText3', tree.node.childNodes.length)
})

test('patch remove Element', () => {
  const node = document.createElement('div')
  const h1 = document.createElement('h1')
  node.insertAdjacentElement('beforeend', h1)
  const p = document.createElement('p')
  node.insertAdjacentElement('beforeend', p)
  const h2 = document.createElement('h2')
  node.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', node: h1 },
      { tag: 'p', node: p },
      { tag: 'h2', node: h2 }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' },
      { tag: 'h2' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchRemoveEl1', tree)
  log('patchRemoveEl2', (tree.node.childNodes[0] as Element).tagName)
  log('patchRemoveEl3', (tree.node.childNodes[1] as Element).tagName)
})

test('patch use key', () => {
  const node = document.createElement('div')
  const h1 = document.createElement('h1')
  node.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  node.insertAdjacentElement('beforeend', h2)
  const h1key = {}
  const h2key = {}
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', node: h1, key: h1key },
      { tag: 'h2', node: h2, key: h2key }
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h2', key: h2key },
      { tag: 'h1', key: h1key, class: ['class-a'] }
    ]
  } as VirtualElement
  patchChildren(tree, newTree)
  log('patchUseKey1', tree)
  log('patchUseKey2', (tree.node.childNodes[0] as Element).tagName)
  log('patchUseKey3', (tree.node.childNodes[1] as Element).tagName)
  log('patchUseKey4', tree.node.lastElementChild?.classList.length)
  log('patchUseKey5', tree.node.childNodes[0] === h2)
  log('patchUseKey6', tree.node.childNodes[1] === h1)
})

test('patch use key and number', () => {
  const node = document.createElement('div')
  const p = document.createElement('p')
  node.insertAdjacentElement('beforeend', p)
  const h1 = document.createElement('h1')
  node.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  node.insertAdjacentElement('beforeend', h2)
  const h1key = {}
  const h2key = {}
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', node: p },
      0,
      { tag: 'h1', node: h1, key: h1key },
      { tag: 'h2', node: h2, key: h2key },
      1
    ],
    node
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello',
      0,
      { tag: 'h2', key: h2key },
      1,
      { tag: 'h1', key: h1key }
    ]
  }
  patchChildren(tree, newTree)
  log('patchUseKeyAndNumber1', tree)
  log('patchUseKeyAndNumber2', tree.node.innerHTML)
  log('patchUseKeyAndNumber3', tree.node.childNodes[1] === h2)
  log('patchUseKeyAndNumber4', tree.node.childNodes[2] !== h1)
})
