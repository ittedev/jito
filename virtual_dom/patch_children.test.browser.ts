import { test, log } from '../_helper/document_console.ts'
import { patchChildren } from './patch_children.ts'
import { VirtualElement, LinkedVirtualElement } from './VirtualElement.ts'

test('patch new text', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    children: ['Hello']
  }
  patchChildren(tree, newTree)
  log('patchNewText1', tree)
  log('patchNewText2', tree.el.innerHTML)
})

test('patch new multi texts', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    children: ['Hello', 'world', '!']
  }
  patchChildren(tree, newTree)
  log('patchNewMultiText1', tree)
  log('patchNewMultiText2', tree.el.innerHTML)
})


test('test: patch update text', () => {
  const el = document.createElement('div')
  el.innerHTML = 'Hello'
  const tree = {
    tag: 'div',
    children: ['Hello'],
    el
  }
  const newTree = {
    tag: 'div',
    children: ['World'],
    el
  }
  patchChildren(tree, newTree)
  log('patchUpdateText1', tree)
  log('patchUpdateText2', tree.el.innerHTML)
})


test('patch new Element', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewEl1', tree)
  log('patchNewEl2', tree.el.firstElementChild?.tagName)
})

test('patch new multi Elements', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
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
  log('patchNewMultiEl2', tree.el.children[0].tagName)
  log('patchNewMultiEl3', tree.el.children[1].tagName)
  log('patchNewMultiEl4', tree.el.children[2].tagName)
})

test('patch update Element', () => {
  const el = document.createElement('div')
  const p = document.createElement('p')
  el.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', el: p }
    ],
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p', class: ['class-a'] }
    ]
  }
  patchChildren(tree, newTree)
  log('patchUpdateEl1', tree)
  log('patchUpdateEl2', tree.el.firstElementChild?.tagName)
  log('patchUpdateEl3', tree.el.firstElementChild?.classList.length)
  log('patchUpdateEl4', tree.el.firstElementChild === p)
})

test('patch change Element', () => {
  const el = document.createElement('div')
  const p = document.createElement('p')
  el.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', el: p }
    ],
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'h1' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeEl1', tree)
  log('patchChangeEl2', tree.el.firstElementChild?.tagName)
  log('patchChangeEl3', tree.el.firstElementChild === p)
})

test('patch new Number', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      0
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewNumber1', tree)
  log('patchNewNumber2', tree.el.childElementCount)
})

test('patch new multi Numbers', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      100, 1, 0
    ]
  }
  patchChildren(tree, newTree)
  log('patchNewMultiNumber1', tree)
  log('patchNewMultiNumber2', tree.el.childElementCount)
})

test('patch new cross Nodes', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
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
  log('patchNewCrossNode2', tree.el.innerHTML)
  log('patchNewCrossNode3', tree.el.children[0].tagName)
  log('patchNewCrossNode4', tree.el.children[1].tagName)
  log('patchNewCrossNode5', tree.el.children[2].tagName)
})

test('patch change text to Element', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    children: [
      'Hello'
    ],
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      { tag: 'p' }
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeTextToEl1', tree)
  log('patchChangeTextToEl2', tree.el.firstElementChild?.tagName)
  log('patchChangeTextToEl3', tree.el.childNodes.length)
})

test('patch change Element to text', () => {
  const el = document.createElement('div')
  const p = document.createElement('p')
  el.insertAdjacentElement('beforeend', p)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', el: p }
    ],
    el
  }
  const newTree = {
    tag: 'div',
    children: [
      'Hello'
    ]
  }
  patchChildren(tree, newTree)
  log('patchChangeElToText1', tree)
  log('patchChangeElToText2', tree.el.innerHTML)
  log('patchChangeElToText3', tree.el.childNodes.length)
})

test('patch add text to texts', () => {
  const el = document.createElement('div')
  el.insertAdjacentText('beforeend', 'Hello')
  el.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      '!'
    ],
    el
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
  log('patchAddTextToText2', tree.el.innerHTML)
  log('patchAddTextToText3', tree.el.childNodes.length)
})

test('patch add text to Elements', () => {
  const el = document.createElement('div')
  const h1 = document.createElement('h1')
  el.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  el.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', el: h1 },
      { tag: 'h2', el: h2 }
    ],
    el
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
  log('patchAddTextToEl2', tree.el.innerHTML)
  log('patchAddTextToEl3', tree.el.childNodes.length)
  log('patchAddTextToEl4', (tree.el.childNodes[0] as Element).tagName)
  log('patchAddTextToEl5', (tree.el.childNodes[2] as Element).tagName)
})

test('patch add Element to texts', () => {
  const el = document.createElement('div')
  el.insertAdjacentText('beforeend', 'Hello')
  el.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      '!'
    ],
    el
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
  log('patchAddElToText2', tree.el.innerHTML)
  log('patchAddElToText3', tree.el.childNodes.length)
  log('patchAddElToText4', (tree.el.childNodes[1] as Element).tagName)
})

test('patch add Element to Elements', () => {
  const el = document.createElement('div')
  const h1 = document.createElement('h1')
  el.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  el.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', el: h1 },
      { tag: 'h2', el: h2 }
    ],
    el
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
  log('patchAddElToEl2', (tree.el.childNodes[0] as Element).tagName)
  log('patchAddElToEl3', (tree.el.childNodes[1] as Element).tagName)
  log('patchAddElToEl4', (tree.el.childNodes[2] as Element).tagName)
})

test('patch remove text', () => {
  const el = document.createElement('div')
  el.insertAdjacentText('beforeend', 'Hello')
  el.insertAdjacentText('beforeend', '!')
  const tree = {
    tag: 'div',
    children: [
      'Hello',
      'World',
      '!'
    ],
    el
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
  log('patchRemoveText2', tree.el.innerHTML)
  log('patchRemoveText3', tree.el.childNodes.length)
})

test('patch remove Element', () => {
  const el = document.createElement('div')
  const h1 = document.createElement('h1')
  el.insertAdjacentElement('beforeend', h1)
  const p = document.createElement('p')
  el.insertAdjacentElement('beforeend', p)
  const h2 = document.createElement('h2')
  el.insertAdjacentElement('beforeend', h2)
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', el: h1 },
      { tag: 'p', el: p },
      { tag: 'h2', el: h2 }
    ],
    el
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
  log('patchRemoveEl2', (tree.el.childNodes[0] as Element).tagName)
  log('patchRemoveEl3', (tree.el.childNodes[1] as Element).tagName)
})

test('patch use key', () => {
  const el = document.createElement('div')
  const h1 = document.createElement('h1')
  el.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  el.insertAdjacentElement('beforeend', h2)
  const h1key = {}
  const h2key = {}
  const tree = {
    tag: 'div',
    children: [
      { tag: 'h1', el: h1, key: h1key },
      { tag: 'h2', el: h2, key: h2key }
    ],
    el
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
  log('patchUseKey2', (tree.el.childNodes[0] as Element).tagName)
  log('patchUseKey3', (tree.el.childNodes[1] as Element).tagName)
  log('patchUseKey4', tree.el.lastElementChild?.classList.length)
  log('patchUseKey5', tree.el.childNodes[0] === h2)
  log('patchUseKey6', tree.el.childNodes[1] === h1)
})

test('patch use key and number', () => {
  const el = document.createElement('div')
  const p = document.createElement('p')
  el.insertAdjacentElement('beforeend', p)
  const h1 = document.createElement('h1')
  el.insertAdjacentElement('beforeend', h1)
  const h2 = document.createElement('h2')
  el.insertAdjacentElement('beforeend', h2)
  const h1key = {}
  const h2key = {}
  const tree = {
    tag: 'div',
    children: [
      { tag: 'p', el: p },
      0,
      { tag: 'h1', el: h1, key: h1key },
      { tag: 'h2', el: h2, key: h2key },
      1
    ],
    el
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
  log('patchUseKeyAndNumber2', tree.el.innerHTML)
  log('patchUseKeyAndNumber3', tree.el.childNodes[1] === h2)
  log('patchUseKeyAndNumber4', tree.el.childNodes[2] !== h1)
})
