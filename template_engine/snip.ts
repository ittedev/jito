import {
  Template,
  Snippet,
  Restack
} from './types.ts'
import { parse } from './parse.ts'

export function snip(
  template: Template | string,
  restack?: Restack
): Snippet
{
  return {
    template: typeof template === 'string' ? parse(template) : template,
    restack: restack || (s => s)
  }
}