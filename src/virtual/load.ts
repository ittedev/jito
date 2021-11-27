import { Element, Document } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'
import { VirtualElement } from './VirtualElement.ts'

/**
 * Create a vertual tree from a dom node.
 * @alpha
 */
 export const load = (node: Element | Document): VirtualElement => {
  return { tag: 'body' }
}
