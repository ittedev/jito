import { Element } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'

export interface VirtualElement {
  tag: string,
  class?: Array<string>,
  style?: {
    [name: string]: string
  },
  attr?: {
    [name: string]: string | ((event?: Event) => void)
  },
  children?: Array<string | VirtualElement>
  key?: unknown,
  elm?: Element
}
