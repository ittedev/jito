import {
  Elementable,
  Panel,
} from './type.ts'
import { appear } from './push.ts'

export function panel(): Panel {
  let pages = new Map<string | number, Elementable>()
  let leftHistoryQueue: (string | number)[] = []
  let rightHistoryQueue: (string | number)[] = []

  let panel: Panel = {
    current: null,
    panel: null,

    page(name: string | number, component: Elementable): void {
      pages.set(name, component)
    },

    async push(name: string | number): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = await appear(page)
        if (this.current !== null) {
          leftHistoryQueue.push(this.current)
        }
        this.current = name
        if (rightHistoryQueue.length) {
          rightHistoryQueue = []
        }
      }
    },

    async replace(name: string | number): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = await appear(page)
        this.current = name
      }
    },

    async back(): Promise<void> {
      if (leftHistoryQueue.length) {
        let name = leftHistoryQueue.pop() as string | number
        this.panel = await appear(pages.get(name) as Elementable)
        rightHistoryQueue.push(this.current as string | number)
        this.current = name
      }
    },

    async forward(): Promise<void> {
      if (rightHistoryQueue.length) {
        let name = rightHistoryQueue.pop() as string | number
        this.panel = await appear(pages.get(name) as Elementable)
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
