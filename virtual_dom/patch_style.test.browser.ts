import { log } from '../_helper/document_console.ts'
import { patchStyle } from './patch_style.ts'

// test: patch new style
{
  const el = document.createElement('div')
  const tree = {
    tag: 'div',
    el
  }
  const newTree = {
    tag: 'div',
    style: 'color: red;'
  }
  patchStyle(tree, newTree)
  log('patchNewStyle1', tree)
  log('patchNewStyle2', tree.el.style.cssText)
}

// test: patch add style
{
  const el = document.createElement('div')
  el.style.cssText = 'color: red;'
  const tree = {
    tag: 'div',
    style: 'color: red;',
    el
  }
  const newTree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;'
  }
  patchStyle(tree, newTree)
  log('patchAddStyle1', tree)
  log('patchAddStyle2', tree.el.style.cssText)
}

// test: patch remove style
{
  const el = document.createElement('div')
  el.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const tree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    el
  }
  const newTree = {
    tag: 'div',
    style: 'font-size: 1px; color: red;'
  }
  patchStyle(tree, newTree)
  log('patchRemoveStyle1', tree)
  log('patchRemoveStyle2', tree.el.style.cssText)
}

// test: patch remove All style
{
  const el = document.createElement('div')
  el.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const tree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    el
  }
  const newTree = {
    tag: 'div'
  }
  patchStyle(tree, newTree)
  log('patchRemoveAllStyle1', tree)
  log('patchRemoveAllStyle2', tree.el.style.cssText)
}

// test: patch set empty style
{
  const el = document.createElement('div')
  el.style.cssText = 'font-size: 1px; margin: auto; color: red;'
  const tree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto; color: red;',
    el
  }
  const newTree = {
    tag: 'div',
    style: ''
  }
  patchStyle(tree, newTree)
  log('patchSetEmptyStyle1', tree)
  log('patchSetEmptyStyle2', tree.el.style.cssText)
}

// test: patch no change style
{
  const el = document.createElement('div')
  el.style.cssText = 'font-size: 1px; margin: auto;'
  const tree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto;',
    el
  }
  const newTree = {
    tag: 'div',
    style: 'font-size: 1px; margin: auto;'
  }
  patchStyle(tree, newTree)
  log('patchNoChangeStyle1', tree)
  log('patchNoChangeStyle2', tree.el.style.cssText)
}
