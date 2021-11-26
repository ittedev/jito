import { VirtualElement } from './vdom.ts'

export interface Template {
}

export const parse = (html: string, css?: string): Template => {
  return {}
}

export const generate = (template: Template, data?: Object): VirtualElement => {
  return {}
}
