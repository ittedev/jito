// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../../_helper/test.ts'
import { assertObjectMatch } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch_class.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch new class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      class: ['class-a'],
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewClass2')?.innerText) as string)
    assertObjectMatch(['class-a'], data)
  }
  await Sinco.done()
})

await Deno.test('patch add class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      class: ['class-a', 'class-b', 'class-c'],
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddClass2')?.innerText) as string)
    assertObjectMatch(['class-a', 'class-b', 'class-c'], data)
  }
  await Sinco.done()
})

await Deno.test('patch remove class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      class: ['class-a', 'class-c'],
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveClass2')?.innerText) as string)
    assertObjectMatch(['class-a', 'class-c'], data)
  }
  await Sinco.done()
})

await Deno.test('patch remove all class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllClass2')?.innerText) as string)
    assertObjectMatch([], data)
  }
  await Sinco.done()
})

await Deno.test('patch set empty class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyClass2')?.innerText) as string)
    assertObjectMatch([], data)
  }
  await Sinco.done()
})

await Deno.test('patch no change class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangeClass1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      class: ['class-a', 'class-b'],
      node: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangeClass2')?.innerText) as string)
    assertObjectMatch(['class-a', 'class-b'], data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))