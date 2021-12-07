import { buildBrowserFile } from '../_helper/test.ts'
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch change tag', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeTag1')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTag2')?.innerText) as string
    assertStrictEquals('P', data)
  }
  await Sinco.done()
})

await Deno.test('patch change tag', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther1')?.innerText) as string)
    assertObjectMatch({
      tag: 'p',
      class: ['class-a'],
      part: ['part-a'],
      style: 'color: red;',
      attr: {
        'attr-a': 'value 1'
      },
      children: [
        'Hello'
      ],
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther2')?.innerText) as string
    assertStrictEquals('P', data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther3')?.innerText) as string)
    assertObjectMatch(['class-a'], data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther4')?.innerText) as string)
    assertObjectMatch(['part-a'], data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther5')?.innerText) as string
    assertStrictEquals('color: red;', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther6')?.innerText) as string
    assertStrictEquals('attr-a: value 1;', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTagAndOther7')?.innerText) as string
    assertStrictEquals('Hello', data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))