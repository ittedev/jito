import { log } from '../_helper/document_console.ts'
import { patchPart } from './patch_part.ts'

// test: patch new part
{
  const el = document.createElement('div')
  const ve = {
    tag: 'div',
    el
  }
  const newVE = {
    tag: 'div',
    part: ['part-a'],
    el
  }
  patchPart(ve, newVE)
  log('patchNewPart1', ve)
  log('patchNewPart2', [...ve.el.part.values()])
}

// test: patch add part
{
  const el = document.createElement('div')
  el.part.add('part-a')
  const ve = {
    tag: 'div',
    part: ['part-a'],
    el
  }
  const newVE = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  patchPart(ve, newVE)
  log('patchAddPart1', ve)
  log('patchAddPart2', [...ve.el.part.values()])
}

// test: patch remove part
{
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const ve = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newVE = {
    tag: 'div',
    part: ['part-a', 'part-c'],
    el
  }
  patchPart(ve, newVE)
  log('patchRemovePart1', ve)
  log('patchRemovePart2', [...ve.el.part.values()])
}

// test: patch remove all part
{
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const ve = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newVE = {
    tag: 'div',
    el
  }
  patchPart(ve, newVE)
  log('patchRemoveAllPart1', ve)
  log('patchRemoveAllPart2', [...ve.el.part.values()])
}

// test: patch set empty part
{
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b', 'part-c')
  const ve = {
    tag: 'div',
    part: ['part-a', 'part-b', 'part-c'],
    el
  }
  const newVE = {
    tag: 'div',
    part: [],
    el
  }
  patchPart(ve, newVE)
  log('patchSetEmptyPart1', ve)
  log('patchSetEmptyPart2', [...ve.el.part.values()])
}

// test: patch no change part
{
  const el = document.createElement('div')
  el.part.add('part-a', 'part-b')
  const ve = {
    tag: 'div',
    part: ['part-a', 'part-b'],
    el
  }
  const newVE = {
    tag: 'div',
    part: ['part-a', 'part-b'],
    el
  }
  patchPart(ve, newVE)
  log('patchNoChangePart1', ve)
  log('patchNoChangePart2', [...ve.el.part.values()])
}
