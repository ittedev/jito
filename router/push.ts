import { Component } from '../web_components/types.ts'
import {
  Page,
} from './type.ts'
import {
  pageTupples,
  router,
} from './router.ts'

export function push(pathname: string): void {
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
      router.pathname = pathname
      router.router = page[1] as Component
      router.params = params
      history.pushState({}, '', pathname)
      break
    }
  }
}