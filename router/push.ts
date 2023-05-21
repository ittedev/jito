import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Elementable,
  Page,
  MatchedPageData,
} from './type.ts'
import {
  pageTupples,
  leftHistoryQueue,
  elementHolder,
  router,
} from './router.ts'
import { replace } from './replace.ts'

export async function push(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    let props = await validate(tupple, false)
    if (props) {
      // router.pathname = pathname
      // router.router = await getRouter(tupple[2])
      // router.params = tupple[1]
      history.pushState({}, '', pathname)
    }
  }
}

export function find(pathname: string): MatchedPageData | undefined {
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
      return { pathname, params, page }
    }
  }
}

export async function appear(component: Elementable): Promise<Component | Module | Element> {
  if (typeof component === 'string') {
    return await import(component)
  } else {
    return await component
  }
}

// export async function getRouter(page: Page): Promise<Component | Module | Element> {
//   if (page[4]) {
//     if (!elementHolder.has(page[0])) {
//       let elementable = await appear(page[3])
//       elementHolder.set(page[0], elementable instanceof Element ? elementable : await page[4](elementable))
//     }
//     return elementHolder.get(page[0]) as Element
//   } else {
//     return await appear(page[3])
//   }
// }

export async function validate(data: MatchedPageData, isReplace: boolean): Promise<Record<string, unknown> | undefined> {
  let props: Record<string, unknown> = {}
  for (let middleware of data.page[2]) {
    let result = await middleware({
      pathname: data.pathname,
      params: data.params,
      props,
      next: (newProps?: Record<string, unknown>) => {
        props = newProps || {}
        return true
      },
      redirect: (pathname: string, reload = false) => {
        if (reload) {
          if (isReplace) {
            replace(pathname)
          } else {
            push(pathname)
          }
        } else {
          if (isReplace) {
            location.replace(pathname)
          } else {
            location.href = pathname
          }
        }
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
