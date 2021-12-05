import { log } from '../_helper/document_console.ts'
import { patch } from './patch.ts'

// test: patch change tag
{
  const el = document.createElement('div')
  const ve = {
    tag: 'div',
    el
  }
  const newVE = {
    tag: 'p',
    el
  }
  const patchedVE = patch(ve, newVE)
  log('patchChangeTag1', patchedVE)
  log('patchChangeTag2', patchedVE.el.tagName)
}

// test: patch change tag and other
{
  const el = document.createElement('div')
  const ve = {
    tag: 'div',
    el
  }
  const newVE = {
    tag: 'p',
    class: ['class-a'],
    part: ['part-a'],
    style: 'color: red;',
    attr: {
      'attr-a': 'value 1'
    },
    el
  }
  const patchedVE = patch(ve, newVE)
  log('patchChangeTagAndOther1', patchedVE)
  log('patchChangeTagAndOther2', patchedVE.el.tagName)
  log('patchChangeTagAndOther3', [...patchedVE.el.classList.values()])
  log('patchChangeTagAndOther4', [...patchedVE.el.part.values()])
  log('patchChangeTagAndOther5', (patchedVE.el as HTMLElement).style.cssText)
  let output = ''
  for(const attr of patchedVE.el.attributes) {
    if ('class style part'.includes(attr.name)) {
      continue
    }
    output += attr.name + ': ' + attr.value + ';';
  }
  log('patchChangeTagAndOther6', output)
}
