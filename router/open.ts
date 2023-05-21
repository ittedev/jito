import {
  Elementable,
  Page,
  MatchedPageData,
} from './type.ts'
import { replace } from './replace.ts'
import { push } from './push.ts'
import {
  pageTupples,
  leftHistoryQueue,
  router,
} from './router.ts'

export async function open(pathname: string, props: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  let mutchedData = find(pathname)
  if (mutchedData) {
    // let redirect = (pathname: string, reload = false) => {
      // if (reload) {
      //   if (isReplace) {
      //     replace(pathname)
      //   } else {
      //     push(pathname)
      //   }
      // } else {
      //   if (isReplace) {
      //     location.replace(pathname)
      //   } else {
      //     location.href = pathname
      //   }
      // }
    //   return false
    // }
    let block = () => false
    for (let middleware of mutchedData.page[2]) {
      let result = await middleware({
        pathname: mutchedData.pathname,
        params: mutchedData.params,
        props,
        next: (newProps?: Record<string, unknown>) => {
          props = newProps || {}
          return true
        },
        block: block as () => false,
      })
      if (result !== undefined && !result) {
        throw Error()
      }
    }
    return props
  }
  throw Error() // not found
}

function find(pathname: string): MatchedPageData | undefined {
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
