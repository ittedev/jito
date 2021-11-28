import { buildBrowserFile, getTextById } from '../_helper/test.ts'
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/load.test.browser.ts'
buildBrowserFile(fileName)

Deno.test('loadTest', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:4507/${fileName}.html`)
  assertEquals(await Sinco.evaluatePage(getTextById('loadTest')), "aaa")
  await Sinco.done();
})
