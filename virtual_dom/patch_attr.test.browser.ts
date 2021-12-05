import { log } from '../_helper/document_console.ts'
import { patchAttr } from './patch_attr.ts'

// test: patch new attr
{
  const el = document.createElement('div')
  const ve = {
    tag: 'div',
    el
  }
  const newVE = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  patchAttr(ve, newVE)
  log('patchNewAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNewAttr2', output)
}

// test: patch add attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  const newVE = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  patchAttr(ve, newVE)
  log('patchAddAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
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
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newVE = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-c': 'value 3'
    },
    el
  }
  patchAttr(ve, newVE)
  log('patchRemoveAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
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
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newVE = {
    tag: 'div',
    el
  }
  patchAttr(ve, newVE)
  log('patchRemoveAllAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
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
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2',
      'attr-c': 'value 3'
    },
    el
  }
  const newVE = {
    tag: 'div',
    attr: {},
    el
  }
  patchAttr(ve, newVE)
  log('patchSetEmptyAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchSetEmptyAttr2', output)
}

// test: patch no change attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  el.setAttribute('attr-b', 'value 2')
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    },
    el
  }
  const newVE = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1',
      'attr-b': 'value 2'
    },
    el
  }
  patchAttr(ve, newVE)
  log('patchNoChangeAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchNoChangeAttr2', output)
}

// test: patch update attr
{
  const el = document.createElement('div')
  el.setAttribute('attr-a', 'value 1')
  const ve = {
    tag: 'div',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  const newVE = {
    tag: 'div',
    attr: {
      'attr-a': 'value 2'
    },
    el
  }
  patchAttr(ve, newVE)
  log('patchUpdateAttr1', ve)
  let output = ''
  for(const attr of ve.el.attributes) {
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchUpdateAttr2', output)
}
