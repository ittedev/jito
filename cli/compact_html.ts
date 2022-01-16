import * as denoDom from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'
import { Template } from '../template_engine/types.ts'

interface Window {
  DOMParser: typeof denoDom.DOMParser
}
// deno-lint-ignore no-var
declare var window: Window

window.DOMParser = denoDom.DOMParser

const { parse } = await import('../template_engine/parse.ts')
const { extend } = await import('../web_components/extend.ts')

function trim(str: string) {
  return str.replace(/^(\s|\n)+|(\s|\n)+$/g,'')
}

export function compactHtml(name: string, html : string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const dataContent = trim(doc.querySelector('script')?.innerHTML || 'export default undefined')
  doc.querySelectorAll('script').forEach(node => node.remove())
  const template = extend(parse(trim(doc.head.innerHTML) + trim(doc.body.innerHTML))) as Template
  const componentContent = `import * as data from './${name}_data.js'
export default {
  template: ${JSON.stringify(template)},
  data,
  options: { mode: 'open', delegatesFocus: true } 
}`
  return {
    dataFile: {
      name: `${name}_data.js`,
      content: dataContent
    },
    componentFile: {
      name: `${name}.js`,
      content: componentContent
    }
  }
}
