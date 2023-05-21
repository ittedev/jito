import {
  Page,
  MatchedPageData,
} from './type.ts'
import {
  pageTupples,
  leftHistoryQueue,
  router,
} from './router.ts'

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