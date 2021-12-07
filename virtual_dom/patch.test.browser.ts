import { test, log } from '../_helper/document_console.ts'
import { patch } from './patch.ts'

test('patch change tag', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'p'
  }
  const patchedTree = patch(tree, newTree)
  log('patchChangeTag1', patchedTree)
  log('patchChangeTag2', patchedTree.el.tagName)
})

test('patch change tag and other', () => {
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
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
  const patchedTree = patch(tree, newTree)
  log('patchChangeTagAndOther1', patchedTree)
  log('patchChangeTagAndOther2', patchedTree.el.tagName)
  log('patchChangeTagAndOther3', [...patchedTree.el.classList.values()])
  log('patchChangeTagAndOther4', [...patchedTree.el.part.values()])
  log('patchChangeTagAndOther5', (patchedTree.el as HTMLElement).style.cssText)
  let output = ''
  for(const attr of patchedTree.el.attributes) {
    if ('class style part'.includes(attr.name)) {
      continue
    }
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchChangeTagAndOther6', output)
  log('patchChangeTagAndOther7', patchedTree.el.innerHTML)
})
