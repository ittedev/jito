import { VirtualElement } from '../virtual-dom/VirtualElement.ts'
import { Template } from './types.ts'

export const generate = (template: Template, data?: Object): VirtualElement => {
  return { tag: 'body' }
}
