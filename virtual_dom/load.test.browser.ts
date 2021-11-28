import { log } from '../_helper/document_console.ts'
import { load } from './load.ts'

const doc = new DOMParser().parseFromString(`
  <p>Hello</p>
`, 'text/html')
const vtree = load(doc.body)
log('loadTest', vtree)
