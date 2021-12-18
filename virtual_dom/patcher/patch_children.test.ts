// Copyright 2021 itte.dev. All rights reserved. MIT license.
import { buildBrowserFile } from '../../_helper/test.ts'
import { assertObjectMatch, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { buildFor } from 'https://deno.land/x/sinco@v2.0.0/mod.ts'

const fileName = 'virtual_dom/patch_children.test.browser.ts'
buildBrowserFile(fileName)

await Deno.test('patch new text', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: ['Hello'],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewText2')?.innerText) as string
    assertStrictEquals('Hello', data)
  }
  await Sinco.done()
})
  
await Deno.test('patch new multi texts', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewMultiText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: ['Hello', 'world', '!'],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewMultiText2')?.innerText) as string
    assertStrictEquals('Helloworld!', data)
  }
  await Sinco.done()
})

await Deno.test('patch update text', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchUpdateText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: ['World'],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUpdateText2')?.innerText) as string
    assertStrictEquals('World', data)
  }
  await Sinco.done()
})

await Deno.test('patch new Element', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'p',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewEl2')?.innerText) as string
    assertStrictEquals('P', data)
  }
  await Sinco.done()
})

await Deno.test('patch new multi Elements', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewMultiEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'h1',
          node: {}
        },
        {
          tag: 'h2',
          node: {}
        },
        {
          tag: 'p',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewMultiEl2')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewMultiEl3')?.innerText) as string
    assertStrictEquals('H2', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewMultiEl4')?.innerText) as string
    assertStrictEquals('P', data)
  }
  await Sinco.done()
})

await Deno.test('patch update Element', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchUpdateEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'p',
          class: ['class-a'],
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUpdateEl2')?.innerText) as string
    assertStrictEquals('P', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUpdateEl3')?.innerText) as string
    assertStrictEquals('1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUpdateEl4')?.innerText) as string
    assertStrictEquals('true', data)
  }
  await Sinco.done()
})

await Deno.test('patch change Element', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'h1',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeEl2')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeEl3')?.innerText) as string
    assertStrictEquals('false', data)
  }
  await Sinco.done()
})

await Deno.test('patch new Number', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewNumber1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        0
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewNumber2')?.innerText) as string
    assertStrictEquals('0', data)
  }
  await Sinco.done()
})

await Deno.test('patch new multi Numbers', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewMultiNumber1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        100, 1, 0
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewMultiNumber2')?.innerText) as string
    assertStrictEquals('0', data)
  }
  await Sinco.done()
})

await Deno.test('patch new cross Nodes', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchNewCrossNode1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello',
        {
          tag: 'br',
          node: {}
        },
        'world',
        '!',
        10,
        {
          tag: 'span',
          node: {}
        },
        {
          tag: 'a',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewCrossNode2')?.innerText) as string
    assertStrictEquals('Hello\nworld!', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewCrossNode3')?.innerText) as string
    assertStrictEquals('BR', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewCrossNode4')?.innerText) as string
    assertStrictEquals('SPAN', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchNewCrossNode5')?.innerText) as string
    assertStrictEquals('A', data)
  }
  await Sinco.done()
})

await Deno.test('patch change text to Element', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeTextToEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'p',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTextToEl2')?.innerText) as string
    assertStrictEquals('P', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeTextToEl3')?.innerText) as string
    assertStrictEquals('1', data)
  }
  await Sinco.done()
})

await Deno.test('patch change Element to text', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchChangeElToText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello'
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeElToText2')?.innerText) as string
    assertStrictEquals('Hello', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchChangeElToText3')?.innerText) as string
    assertStrictEquals('1', data)
  }
  await Sinco.done()
})

await Deno.test('patch add text to texts', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddTextToText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello',
        'World',
        '!'
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToText2')?.innerText) as string
    assertStrictEquals('HelloWorld!', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToText3')?.innerText) as string
    assertStrictEquals('3', data)
  }
  await Sinco.done()
})

await Deno.test('patch add text to Elements', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddTextToEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'h1',
          node: {}
        },
        'World',
        {
          tag: 'h2',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToEl2')?.innerText) as string
    assertStrictEquals('World', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToEl3')?.innerText) as string
    assertStrictEquals('3', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToEl4')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddTextToEl5')?.innerText) as string
    assertStrictEquals('H2', data)
  }
  await Sinco.done()
})

await Deno.test('patch add Element to text', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddElToText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello',
        {
          tag: 'span',
          node: {}
        },
        '!'
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToText2')?.innerText) as string
    assertStrictEquals('Hello!', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToText3')?.innerText) as string
    assertStrictEquals('3', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToText4')?.innerText) as string
    assertStrictEquals('SPAN', data)
  }
  await Sinco.done()
})

await Deno.test('patch add Element to Elements', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchAddElToEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        {
          tag: 'h1',
          node: {}
        },
        {
          tag: 'p',
          node: {}
        },
        {
          tag: 'h2',
          node: {}
        }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToEl2')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToEl3')?.innerText) as string
    assertStrictEquals('P', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchAddElToEl4')?.innerText) as string
    assertStrictEquals('H2', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove text', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveText1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello',
        '!'
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveText2')?.innerText) as string
    assertStrictEquals('Hello!', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveText3')?.innerText) as string
    assertStrictEquals('2', data)
  }
  await Sinco.done()
})

await Deno.test('patch remove Element', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchRemoveEl1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        { tag: 'h1', node: {} },
        { tag: 'h2', node: {} }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveEl2')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchRemoveEl3')?.innerText) as string
    assertStrictEquals('H2', data)
  }
  await Sinco.done()
})

await Deno.test('patch use key', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchUseKey1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        { tag: 'h2', key: {}, node: {} },
        { tag: 'h1', key: {}, class: ['class-a'], node: {} }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKey2')?.innerText) as string
    assertStrictEquals('H2', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKey3')?.innerText) as string
    assertStrictEquals('H1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKey4')?.innerText) as string
    assertStrictEquals('1', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKey5')?.innerText) as string
    assertStrictEquals('true', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKey6')?.innerText) as string
    assertStrictEquals('true', data)
  }
  await Sinco.done()
})

await Deno.test('patch use key and number', async () => {
  const Sinco = await buildFor("chrome")
  await Sinco.goTo(`http://0.0.0.0:2555/${fileName}.html`)
  {
    const data = JSON.parse(await Sinco.evaluatePage(() => document.getElementById('patchUseKeyAndNumber1')?.innerText) as string)
    assertObjectMatch({
      tag: 'div',
      children: [
        'Hello',
        0,
        { tag: 'h2', key: {}, node: {} },
        1,
        { tag: 'h1', key: {}, node: {} }
      ],
      node: {}
    }, data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKeyAndNumber2')?.innerText) as string
    assertStrictEquals('Hello', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKeyAndNumber3')?.innerText) as string
    assertStrictEquals('true', data)
  }
  {
    const data = await Sinco.evaluatePage(() => document.getElementById('patchUseKeyAndNumber4')?.innerText) as string
    assertStrictEquals('true', data)
  }
  await Sinco.done()
})


clearTimeout(setTimeout(() => {}))
await new Promise(_ => setTimeout(_))