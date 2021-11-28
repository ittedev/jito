import { log } from '../_helper/document_console.ts'
import { load } from './load.ts'

// test: load body
{
  const doc = new DOMParser().parseFromString(`<body>Hello</body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBody', vtree)
}
