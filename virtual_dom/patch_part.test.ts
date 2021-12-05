import { buildBrowserFile } from '../_helper/test.ts'
import { assertObjectMatch } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch_part.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch new part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewPart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      part: ['part-a'],
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewPart2')?.innerText) as string)
    assertObjectMatch(['part-a'], data)
  }
  await Sinco.done()
})

await Deno.test('patch add part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddPart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      part: ['part-a', 'part-b', 'part-c'],
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddPart2')?.innerText) as string)
    assertObjectMatch(['part-a', 'part-b', 'part-c'], data)
  }
  await Sinco.done()
})

await Deno.test('patch remove part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemovePart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      part: ['part-a', 'part-c'],
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemovePart2')?.innerText) as string)
    assertObjectMatch(['part-a', 'part-c'], data)
  }
  await Sinco.done()
})

await Deno.test('patch remove all part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllPart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllPart2')?.innerText) as string)
    assertObjectMatch([], data)
  }
  await Sinco.done()
})

await Deno.test('patch set empty part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyPart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyPart2')?.innerText) as string)
    assertObjectMatch([], data)
  }
  await Sinco.done()
})

await Deno.test('patch no change part', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangePart1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      part: ['part-a', 'part-b'],
      el: {}
    }, data)
  }
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangePart2')?.innerText) as string)
    assertObjectMatch(['part-a', 'part-b'], data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))