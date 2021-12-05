import { log } from '../_helper/document_console.ts'
import { load } from './load.ts'

// test: load body
{
  const doc = new DOMParser().parseFromString(`<body></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBody', vtree)
}

// test: load body class
{
  const doc = new DOMParser().parseFromString(`<body class="class-a class-b" onclick="calc">Hello</body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBodyClass', vtree)
}