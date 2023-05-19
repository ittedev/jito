import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Panel,
} from './type.ts'

export function panel(): Panel {
  let pages = new Map<string | number, Component | Promise<Component> | Module | Promise<Module>>()
  let leftHistoryQueue: (string | number)[] = []
  let rightHistoryQueue: (string | number)[] = []

  let panel: Panel = {
    current: null,
    panel: null,

    page(name: string | number, component: Component | Promise<Component> | Module | Promise<Module>): void {
      pages.set(name, component)
    },

    push(name: string | number): void {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = page as Component
        if (this.current !== null) {
          leftHistoryQueue.push(this.current)
        }
        this.current = name
        if (rightHistoryQueue.length) {
          rightHistoryQueue = []
        }
      }
    },

    replace(name: string | number): void {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = page as Component
        this.current = name
      }
    },

    back(): void {
      if (leftHistoryQueue.length) {
        let name = leftHistoryQueue.pop() as string | number
        this.panel = pages.get(name) as Component
        rightHistoryQueue.push(this.current as string | number)
        this.current = name
      }
    },

    forward(): void {
      if (rightHistoryQueue.length) {
        let name = rightHistoryQueue.pop() as string | number
        this.panel = pages.get(name) as Component
        leftHistoryQueue.push(this.current as string | number)
        this.current = name
      }
    },
  }
  panel.push = panel.push.bind(panel)
  panel.replace = panel.replace.bind(panel)
  panel.back = panel.back.bind(panel)
  panel.forward = panel.forward.bind(panel)
  return panel
}
