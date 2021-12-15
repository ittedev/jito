// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../../_helper/test.ts'
import { assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'template_engine/dom_parser/parse_text.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('parseText ', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('parseText')?.innerText) as string
    assertStrictEquals('Hello beako!', data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))
