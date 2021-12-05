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
  const doc = new DOMParser().parseFromString(`<body class="class-a class-b"></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBodyClass', vtree)
}

// test: load body part
{
  const doc = new DOMParser().parseFromString(`<body part="part-a part-b"></body>`, 'text/html')
  const vtree = load(doc.body)
  log('loadBodyPart', vtree)
}