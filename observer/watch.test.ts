import { assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { watch } from './watch.ts'

Deno.test('watch object', () => {
  const data = {
    x: 1
  }
  watch(data)
  assertStrictEquals(data.x, 1)
  data.x = 2
  assertStrictEquals(data.x, 2)
  assertStrictEquals(JSON.stringify(data), '{"x":2}')
})

Deno.test('watch object exec function', () => {
  const data = {
    x: 1
  }
  let y = 0
  watch(data, 'x', (v: number) => { y = v })
  data.x = 2
  assertStrictEquals(y, 2)
})

Deno.test('watch nested object', () => {
  const data = {
    x: {
      x: 1
    }
  }
  let y = 0
  watch(data, 'x.x', (v: number) => { y = v })
  data.x.x = 2
  assertStrictEquals(y, 2)
})