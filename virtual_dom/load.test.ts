// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../_helper/test.ts'
import { assertObjectMatch } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/load.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('load body', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('loadBody')?.innerText) as string)
    assertObjectMatch({
      node: {}
    }, data)
  }
  await Sinco.done()
})

await Deno.test('load body class', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('loadBodyClass')?.innerText) as string)
    assertObjectMatch({
      node: {}
    }, data)
  }
  await Sinco.done()
})

await Deno.test('load body part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('loadBodyPart')?.innerText) as string)
    assertObjectMatch({
      node: {}
    }, data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))
