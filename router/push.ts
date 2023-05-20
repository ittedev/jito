import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Elementable,
  Page,
} from './type.ts'
import {
  pageTupples,
  leftHistoryQueue,
  elementHolder,
  router,
} from './router.ts'

export async function push(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    router.pathname = pathname
    router.router = await getRouter(tupple[0])
    router.params = tupple[1]
    history.pushState({}, '', pathname)
  }
}

export function find(pathname: string): [Page, Record<string, string>] | undefined {
  let names = pathname.split('/')
  let len = names.length
  let kinds = pageTupples[len][0]
  let pages = pageTupples[len][1]
  for (let kind of kinds) {
    let key = names.map((name, index) => (1 << (len - 1 - index)) & kind ? '*' : name).join('/')
    if (pages.has(key)) {
      let page = pages.get(key) as Page
      let params: Record<string, string> = {}
      page[1].forEach(tupple => {
        params[tupple[0]] = names[tupple[1]]
      })
      if (router.pathname !== null) {
        leftHistoryQueue.push(router.pathname)
      }
      return [page, params]
    }
  }
}

export async function appear(component: Elementable): Promise<Component | Module> {
  return await component
}

export async function getRouter(page: Page) : Promise<Component | Module | Element> {
  if (page[3]) {
    if (!elementHolder.has(page[0])) {
      elementHolder.set(page[0], await page[3](await appear(page[2])))
    }
    return elementHolder.get(page[0]) as Element
  } else {
    return await appear(page[2])
  }
}
