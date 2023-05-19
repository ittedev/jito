import {
  Component,
  Module,
  instanceOfModule,
} from '../web_components/types.ts'
import {
  Elementable,
  Page,
} from './type.ts'
import {
  pageTupples,
  leftHistoryQueue,
  router,
} from './router.ts'

export async function push(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    router.pathname = pathname
    router.router = await appear(tupple[0])
    router.params = tupple[1]
    history.pushState({}, '', pathname)
  }
}

export function find(pathname: string): [Elementable, Record<string, string>] | undefined {
  let names = pathname.split('/')
  let len = names.length
  let kinds = pageTupples[len][0]
  let pages = pageTupples[len][1]
  for (let kind of kinds) {
    let key = names.map((name, index) => (1 << (len - 1 - index)) & kind ? '*' : name).join('/')
    if (pages.has(key)) {
      let page = pages.get(key) as Page
      let params: Record<string, string> = {}
      page[0].forEach(tupple => {
        params[tupple[0]] = names[tupple[1]]
      })
      if (router.pathname !== null) {
        leftHistoryQueue.push(router.pathname)
      }
      return [page[1], params]
    }
  }
}

export async function appear(component: Elementable): Promise<Component | Module> {
  return await component
}
