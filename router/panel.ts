import {
  Elementize,
  Elementable,
  PanelName,
  PanelPage,
  Panel,
} from './type.ts'
import { appear } from './push.ts'

export function panel(): Panel {
  let pages = new Map<PanelName, PanelPage>()
  let leftHistoryQueue: (PanelName)[] = []
  let rightHistoryQueue: (PanelName)[] = []
  let elements = new Map<PanelName, Element>()
  let getPanel = async (name: PanelName, page: PanelPage) => {
    if (page[1]) {
      if (!elements.has(name)) {
        let elementable = await appear(page[0])
        elements.set(name, elementable instanceof Element ? elementable : await page[1](elementable))
      }
      return elements.get(name) as Element
    } else {
      return await appear(page[0])
    }
  }

  let panel: Panel = {
    current: null,
    panel: null,

    page(name: PanelName, component: Elementable, elementize?: Elementize): void {
      pages.set(name, [component, elementize])
    },

    async push(name: PanelName): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = await getPanel(name, page)
        if (this.current !== null) {
          leftHistoryQueue.push(this.current)
        }
        this.current = name
        if (rightHistoryQueue.length) {
          rightHistoryQueue = []
        }
      }
    },

    async replace(name: PanelName): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        this.panel = await getPanel(name, page)
        this.current = name
      }
    },

    async back(): Promise<void> {
      if (leftHistoryQueue.length) {
        let name = leftHistoryQueue.pop() as PanelName
        this.panel = await getPanel(name, pages.get(name) as PanelPage)
        rightHistoryQueue.push(this.current as PanelName)
        this.current = name
      }
    },

    async forward(): Promise<void> {
      if (rightHistoryQueue.length) {
        let name = rightHistoryQueue.pop() as PanelName
        this.panel = await getPanel(name, pages.get(name) as PanelPage)
        leftHistoryQueue.push(this.current as PanelName)
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
