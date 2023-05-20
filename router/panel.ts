import {
  PanelMiddleware,
  Elementize,
  Elementable,
  PanelName,
  PanelPage,
  MatchedPanelTupple,
  Panel,
} from './type.ts'
import { appear } from './push.ts'

export function panel(): Panel {
  let pages = new Map<PanelName, PanelPage>()
  let leftHistoryQueue: (PanelName)[] = []
  let rightHistoryQueue: (PanelName)[] = []
  let elements = new Map<PanelName, Element>()

  let getPanel = async (name: PanelName, page: PanelPage) => {
    if (page[2]) {
      if (!elements.has(name)) {
        let elementable = await appear(page[1])
        elements.set(name, elementable instanceof Element ? elementable : await page[2](elementable))
      }
      return elements.get(name) as Element
    } else {
      return await appear(page[1])
    }
}

  async function validate(name: PanelName, page: PanelPage, func: (name: PanelName) => Promise<void>): Promise<Record<string, unknown> | undefined> {
    let props: Record<string, unknown> = {}
    for (let middleware of page[0]) {
      let result = await middleware({
        name,
        props,
        next: (newProps?: Record<string, unknown>) => {
          props = newProps || {}
          return true
        },
        redirect: (name: PanelName) => {
          func(name)
          return false
        },
        block: () => false,
      })
      if (result !== undefined && !result) {
        return
      }
    }
    return props
  }

  let panel: Panel = {
    current: null,
    panel: null,

    page(
      name: PanelName,
      orMiddlewares: PanelMiddleware[] | Elementable,
      orComponent?: Elementable | Elementize,
      elementizable?: Elementize,
    ): void {
      let middlewares = Array.isArray(orMiddlewares) ? orMiddlewares : []
      let component = Array.isArray(orMiddlewares) ? orComponent as Elementable : orMiddlewares
      let elementize = Array.isArray(orMiddlewares) ? elementizable : orComponent as Elementize
      pages.set(name, [middlewares, component, elementize])
    },

    async push(name: PanelName): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        let props = await validate(name, page, this.push)
        if (props) {
          this.panel = await getPanel(name, page)
          if (this.current !== null) {
            leftHistoryQueue.push(this.current)
          }
          this.current = name
          if (rightHistoryQueue.length) {
            rightHistoryQueue = []
          }
        }
      }
    },

    async replace(name: PanelName): Promise<void> {
      let page = pages.get(name)
      if (page !== undefined) {
        let props = await validate(name, page, this.replace)
        if (props) {
          this.panel = await getPanel(name, page)
          this.current = name
        }
      }
    },

    async back(): Promise<void> {
      if (leftHistoryQueue.length) {
        let name = leftHistoryQueue.pop() as PanelName
        let page = pages.get(name) as PanelPage
        let props = await validate(name, page, this.replace)
        if (props) {
          this.panel = await getPanel(name, page)
          rightHistoryQueue.push(this.current as PanelName)
          this.current = name
        }
      }
    },

    async forward(): Promise<void> {
      if (rightHistoryQueue.length) {
        let name = rightHistoryQueue.pop() as PanelName
        let page = pages.get(name) as PanelPage
        let props = await validate(name, page, this.replace)
        if (props) {
          this.panel = await getPanel(name, page)
          leftHistoryQueue.push(this.current as PanelName)
          this.current = name
        }
      }
    },
  }

  panel.push = panel.push.bind(panel)
  panel.replace = panel.replace.bind(panel)
  panel.back = panel.back.bind(panel)
  panel.forward = panel.forward.bind(panel)
  return panel
}
