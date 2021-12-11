// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../../_helper/test.ts'
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch_attr.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch new attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      attr: {
        'attr-a': 'value 1'
      },
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewAttr2')?.innerText) as string
    assertStrictEquals('attr-a: value 1;', data)
  }
  await Sinco.done()
})

await Deno.test('patch add attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      attr: {
        'attr-a': 'value 1',
        'attr-b': 'value 2',
        'attr-c': 'value 3'
      },
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddAttr2')?.innerText) as string
    assertStrictEquals('attr-a: value 1;attr-b: value 2;attr-c: value 3;', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      attr: {
        'attr-a': 'value 1',
        'attr-c': 'value 3'
      },
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveAttr2')?.innerText) as string
    assertStrictEquals('attr-a: value 1;attr-c: value 3;', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove All attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllAttr2')?.innerText) as string
    assertStrictEquals('', data)
  }
  await Sinco.done()
})

await Deno.test('patch set empty attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyAttr2')?.innerText) as string
    assertStrictEquals('', data)
  }
  await Sinco.done()
})

await Deno.test('patch no change attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangeAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      attr: {
        'attr-a': 'value 1',
        'attr-b': 'value 2'
      },
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNoChangeAttr2')?.innerText) as string
    assertStrictEquals('attr-a: value 1;attr-b: value 2;', data)
  }
  await Sinco.done()
})

await Deno.test('patch update attr', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchUpdateAttr1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      attr: {
        'attr-a': 'value 2'
      },
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUpdateAttr2')?.innerText) as string
    assertStrictEquals('attr-a: value 2;', data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))