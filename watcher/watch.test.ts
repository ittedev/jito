import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { watch } from './watch.ts'

Deno.test('watch object', () => {
  const data = {
    x: 1
  }
  watch(data)
  assertEquals(data.x, 1)
  data.x = 2
  assertEquals(data.x, 2)
  assertEquals(JSON.stringify(data), '{"x":2}')
})

Deno.test('watch object exec function', () => {
  const data = {
    x: 1
  }
  let y = 0
  watch(data, 'x', (v: number) => { y = v })
  data.x = 2
  assertEquals(y, 2)
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
  assertEquals(y, 2)
})