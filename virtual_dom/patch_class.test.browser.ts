import { log } from '../_helper/document_console.ts'
import { patchClass } from './patch_class.ts'

// test: patch new class
{
  const el = document.createElement('div')
  const ve = {
    tag: 'div',
    el
  }
  const newVE = {
    tag: 'div',
    class: ['class-a'],
    el
  }
  patchClass(ve, newVE)
  log('patchNewClass1', ve)
  log('patchNewClass2', [...ve.el.classList.values()])
}

// test: patch add class
{
  const el = document.createElement('div')
  el.classList.add('class-a')
  const ve = {
    tag: 'div',
    class: ['class-a'],
    el
  }
  const newVE = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  patchClass(ve, newVE)
  log('patchAddClass1', ve)
  log('patchAddClass2', [...ve.el.classList.values()])
}

// test: patch remove class
{
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const ve = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newVE = {
    tag: 'div',
    class: ['class-a', 'class-c'],
    el
  }
  patchClass(ve, newVE)
  log('patchRemoveClass1', ve)
  log('patchRemoveClass2', [...ve.el.classList.values()])
}

// test: patch remove all class
{
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const ve = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newVE = {
    tag: 'div',
    el
  }
  patchClass(ve, newVE)
  log('patchRemoveAllClass1', ve)
  log('patchRemoveAllClass2', [...ve.el.classList.values()])
}

// test: patch set empty class
{
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b', 'class-c')
  const ve = {
    tag: 'div',
    class: ['class-a', 'class-b', 'class-c'],
    el
  }
  const newVE = {
    tag: 'div',
    class: [],
    el
  }
  patchClass(ve, newVE)
  log('patchSetEmptyClass1', ve)
  log('patchSetEmptyClass2', [...ve.el.classList.values()])
}

// test: patch no change class
{
  const el = document.createElement('div')
  el.classList.add('class-a', 'class-b')
  const ve = {
    tag: 'div',
    class: ['class-a', 'class-b'],
    el
  }
  const newVE = {
    tag: 'div',
    class: ['class-a', 'class-b'],
    el
  }
  patchClass(ve, newVE)
  log('patchNoChangeClass1', ve)
  log('patchNoChangeClass2', [...ve.el.classList.values()])
}
