import { log } from '../_helper/document_console.ts'
import { patchAttr } from './patch_attr.ts'

// test: patch new attr
{
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    }
  }
  patchAttr(tree, newTree)
  log('patchNewAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNewAttr2', output)
}

// test: patch add attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  const newTree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    }
  }
  patchAttr(tree, newTree)
  log('patchAddAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchAddAttr2', output)
}

// test: patch remove attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  el.setAttribute('attr-b', 'value 2')
  el.setAttribute('attr-c', 'value 3')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newTree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-c': 'value 3'
    }
  }
  patchAttr(tree, newTree)
  log('patchRemoveAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchRemoveAttr2', output)
}

// test: patch remove all attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  el.setAttribute('attr-b', 'value 2')
  el.setAttribute('attr-c', 'value 3')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newTree = {
    tag: 'div'
  }
  patchAttr(tree, newTree)
  log('patchRemoveAllAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchRemoveAllAttr2', output)
}

// test: patch set empty attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  el.setAttribute('attr-b', 'value 2')
  el.setAttribute('attr-c', 'value 3')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newTree = {
    tag: 'div',
    attr: {}
  }
  patchAttr(tree, newTree)
  log('patchSetEmptyAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchSetEmptyAttr2', output)
}

// test: patch no change attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  el.setAttribute('attr-b', 'value 2')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    },
    el
  }
  const newTree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    }
  }
  patchAttr(tree, newTree)
  log('patchNoChangeAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNoChangeAttr2', output)
}

// test: patch update attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  const tree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  const newTree = {
    tag: 'div',
    attr: {
      'attr-a': 'value 2'
    }
  }
  patchAttr(tree, newTree)
  log('patchUpdateAttr1', tree)
  let output = ''
  for(const attr of tree.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchUpdateAttr2', output)
}
