import { buildBrowserFile } from '../_helper/test.ts'
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch_style.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch new style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'color: red;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewStyle2')?.innerText) as string
    assertStrictEquals('color: red;', data)
  }
  await Sinco.done()
})

await Deno.test('patch add style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'font-size: 1px; margin: auto; color: red;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddStyle2')?.innerText) as string
    assertStrictEquals('font-size: 1px; margin: auto; color: red;', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'font-size: 1px; color: red;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveStyle2')?.innerText) as string
    assertStrictEquals('font-size: 1px; color: red;', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove All style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'font-size: 1px; color: red;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveAllStyle2')?.innerText) as string
    assertStrictEquals('', data)
  }
  await Sinco.done()
})

await Deno.test('patch set empty style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'font-size: 1px; color: red;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchSetEmptyStyle2')?.innerText) as string
    assertStrictEquals('', data)
  }
  await Sinco.done()
})

await Deno.test('patch no change style', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNoChangeStyle1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      style: 'font-size: 1px; margin: auto;',
      el: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNoChangeStyle2')?.innerText) as string
    assertStrictEquals('font-size: 1px; margin: auto;', data)
  }
  await Sinco.done()
})

clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))