import { MemoryHistory } from './memory_history.ts'
import {
  PageTupple,
  Middleware,
  MatchedPageData,
  Params,
  Page,
} from './type.ts'

class Router {
  private _pageTupples: PageTupple[] = []

  constructor(
    private history: History = new MemoryHistory()
  ) {}

  public page(pattern: string, ...middlewares: Middleware[]): void
  {
    let names = pattern.split('/')
    let len = names.length
    while (this._pageTupples.length < len + 1) {
      this._pageTupples.push([new Set(), new Map()])
    }
    let kinds = this._pageTupples[len][0]
    let pages = this._pageTupples[len][1]
    let kind = names.reduce((kind, name, index) => kind | ((name[0] === ':' ? 1 : 0) << (len - 1 - index)), 0)
    let key = names.map(name => name[0] === ':' ? '*' : name).join('/')
    let params: Params = []
    names.forEach((name, index) => name[0] === ':' && params.push([name.slice(1), index]))
    kinds.add(kind)
    this._pageTupples[len][0] = new Set(Array.from(kinds).sort())
    pages.set(key, [pattern, params, middlewares])
  }

  public async open(
    pathname: string,
    props: Record<string, unknown> = {},
  ): Promise<Record<string, unknown>>
  {
    let mutchedData = this._find(pathname)
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

  public push(pathname: string): Promise<void>
  {
    return this.open(pathname).then(props => {
      // router.pathname = pathname
      // router.router = await getRouter(tupple[2])
      // router.params = tupple[1]
      this.history.pushState({}, '', pathname)
    }).catch(() => {})
  }

  public replace(pathname: string): Promise<void>
  {
    return this.open(pathname).then(props => {
      // router.pathname = pathname
      // router.router = await getRouter(tupple[2])
      // router.params = tupple[1]
      this.history.replaceState({}, '', pathname)
    }).catch(() => {})
  }

  public back(): void
  {
    this.history.back()
  }

  public forward(): void
  {
    this.history.forward()
  }

  private _find(pathname: string): MatchedPageData | undefined {
    let names = pathname.split('/')
    let len = names.length
    let kinds = this._pageTupples[len][0]
    let pages = this._pageTupples[len][1]
    for (let kind of kinds) {
      let key = names.map((name, index) => (1 << (len - 1 - index)) & kind ? '*' : name).join('/')
      if (pages.has(key)) {
        let page = pages.get(key) as Page
        let params: Record<string, string> = {}
        page[1].forEach(tupple => {
          params[tupple[0]] = names[tupple[1]]
        })
        return { pathname, params, page }
      }
    }
  }
}

export let router = new Router(history)

self.addEventListener('popstate', () => {
  router.open(location.pathname).then(props => {
    // router.pathname = location.pathname
    // router.router = await getRouter(tupple[2])
    // router.params = tupple[1]
  }).catch(() => {})
})

export let elementHolder = new Map<string, Element>()

