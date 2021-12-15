// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../../_helper/test.ts'
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'template_engine/dom_parser/parse_element.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('parseElement: ', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('parseElement')?.innerText) as string)
    assertObjectMatch({
      tag: 'p'
    }, data)
  }
  await Sinco.done()
})

await Deno.test('parseElement: style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('parseElementStyle')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      style: 'color: red'
    }, data)
  }
  await Sinco.done()
})

await Deno.test('parseElement: add style only', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('parseElementAddStyleOnly')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      style: 'color: red'
    }, data)
  }
  await Sinco.done()
})

await Deno.test('parseElement: add style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('parseElementAddStyle')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      style: 'color: red;margin-top: 5px'
    }, data)
  }
  await Sinco.done()
})

await Deno.test('parseElement: add styles', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('parseElementAddStyles')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      style: 'color: red;margin-top: 5px;margin: 0 auto'
    }, data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))
