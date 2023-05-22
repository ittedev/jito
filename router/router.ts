import { MemoryHistory } from './memory_history.ts'
import {
  PageTupple,
  Middleware,
  MatchedPageData,
  Params,
  Page,
  SetPage,
  MiddlewareContext,
} from './type.ts'

export class Router {
  private _pageTupples: PageTupple[] = []
  private _history: History | MemoryHistory

  constructor(history: History | MemoryHistory = new MemoryHistory()) {
    this._history = history

    if (history === self.history) {
      self.addEventListener('popstate', (event) => {
        let pathname = event.state && 'pathname' in event.state ? event.state.pathname : location.pathname
        this.open(pathname).catch(() => {})
      })
    } else {
      (history as MemoryHistory).addEventListener('popstate', (event) => {
        this.open(event.state.pathname).catch(() => {})
      })
    }
  }

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

  public section(...middlewares: Middleware[]): SetPage
  {
    return (pattern: string, ...subMiddlewares: Middleware[]) => {
      return this.page(pattern, ...middlewares, ...subMiddlewares)
    }
  }

  public async open(
    pathname: string,
    props: Record<string, unknown> = {},
  ): Promise<Record<string, unknown>>
  {
    let mutchedData = this._find(pathname)
    if (mutchedData) {
      let redirect = (pathname: string) => {
        open(pathname)
        return false
      }
      let block = () => false
      for (let middleware of mutchedData.page[2]) {
        let context: MiddlewareContext
        context = {
          pathname: mutchedData.pathname,
          params: mutchedData.params,
          pattern: mutchedData.page[0],
          props,
          next: (newProps?: Record<string, unknown>) => {
            props = newProps || {}
            return true
          },
          redirect: redirect as (pathname: string) => false,
          block: block as () => false,
          call: (middleware: Middleware) => middleware(context),
        }
        let result = await middleware(context)
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
      this._history.pushState({ pathname }, '', pathname)
    }).catch(() => {})
  }

  public replace(pathname: string): Promise<void>
  {
    return this.open(pathname).then(props => {
      this._history.replaceState({ pathname }, '', pathname)
    }).catch(() => {})
  }

  public back(): void
  {
    this._history.back()
  }

  public forward(): void
  {
    this._history.forward()
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
