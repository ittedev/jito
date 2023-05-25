import { MemoryHistory } from './memory_history.ts'
import {
  PageTupple,
  Middleware,
  MatchedPageData,
  ParamHashs,
  Page,
  SetPage,
  MiddlewareContext,
  RouteContext,
} from './type.ts'
import { TimeRef } from './time_ref.ts'

export class Router {
  private _pageTupples: PageTupple[] = []
  private _history: History | MemoryHistory
  private _from?: RouteContext

  constructor(history: History | MemoryHistory = new MemoryHistory()) {
    this._history = history

    if (history === self.history) {
      self.addEventListener('popstate', (event) => {
        let pathname = event.state && 'pathname' in event.state ? event.state.pathname : location.pathname
        this.open(pathname).catch(() => {})
      })
    } else {
      (history as MemoryHistory).addEventListener('popstate', event => {
        this.open(event.state.pathname).catch(() => {})
      })
    }
  }

  public page(pattern: string, ...middlewares: Middleware[]): void
  {
    let childRouter = new Router()
    let names = pattern.split('/')
    let len = names.length
    while (this._pageTupples.length < len + 1) {
      this._pageTupples.push([new Set(), new Map()])
    }
    let kinds = this._pageTupples[len][0]
    let pages = this._pageTupples[len][1]
    let kind = names.reduce((kind, name, index) => kind | ((name[0] === ':' ? 1 : 0) << (len - 1 - index)), 0)
    let key = names.map(name => name[0] === ':' ? '*' : name).join('/')
    let params: ParamHashs = []
    names.forEach((name, index) => name[0] === ':' && params.push([name.slice(1), index]))
    kinds.add(kind)
    this._pageTupples[len][0] = new Set(Array.from(kinds).sort())
    pages.set(key, [
      pattern,
      params,
      middlewares,
      new TimeRef(childRouter, undefined, ref => !!ref._pageTupples.length),
    ])
  }

  public section(...middlewares: Middleware[]): SetPage
  {
    return (pattern: string, ...subMiddlewares: Middleware[]) => {
      return this.page(pattern, ...middlewares, ...subMiddlewares)
    }
  }

  public open(
    pathname: string,
    props: Record<string, unknown> = {},
    query: Record<string, string> = {},
  ): Promise<RouteContext>
  {
    return this._open(pathname, props, query)
  }

  private _open(
    pathname: string,
    props: Record<string, unknown>,
    query: Record<string, string>,
    parent?: RouteContext,
  ): Promise<RouteContext>
  {
    return new Promise((resolve, reject) => {
      let mutchedData = this._find(pathname)
      if (mutchedData) {
        let currentProps = props
        let currentQuery = query
        let redirect = (pathname: string) => {
          this.open(pathname)
          return false
        }
        let branch = (pathname: string) => {
          let childRouter = (mutchedData as MatchedPageData).page[3].deref() as Router
          if (childRouter) {
            childRouter._open(pathname, currentProps, currentQuery).then(context => resolve(clone(context)))
          }
          return false
        }
        let block = () => false
        ;(async () => {
          for (let middleware of mutchedData.page[2]) {
            let context: MiddlewareContext
            context = {
              parent,
              from: this._history.state,
              pathname: mutchedData.pathname,
              params: mutchedData.params,
              pattern: mutchedData.page[0],
              props: currentProps, // todo sharrow copy
              query: currentQuery, // todo sharrow copy
              next: (newProps?: Record<string, unknown>, newQuery?: Record<string, string>) => {
                if (newProps) {
                  currentProps = newProps
                }
                if (newQuery) {
                  currentQuery = newQuery
                }
                return true
              },
              redirect: redirect as (pathname: string) => false,
              branch: branch as (pathname: string) => false,
              block: block as () => false,
              call: middleware => middleware(context),
            }
            let result = await middleware(context)
            if (result !== undefined && !result) {
              reject()
              throw Error()
            }
          }
        })()
          .then(() => resolve({
            parent,
            from: this._history.state as RouteContext,
            pathname: (mutchedData as MatchedPageData).pathname,
            params: (mutchedData as MatchedPageData).params,
            pattern: (mutchedData as MatchedPageData).page[0],
            props: currentProps,
            query: currentQuery,
          }))
          .catch(() => {})
      }
      reject() // not found
    })
  }

  public push(
    pathname: string,
    props?: Record<string, unknown>,
    query?: Record<string, string>,
  ): Promise<void>
  {
    return this.open(pathname, props, query).then(context => {
      this._history.pushState(clone(context, true), '', createUrl(context))
    }).catch(() => {})
  }

  public replace(
    pathname: string,
    props?: Record<string, unknown>,
    query?: Record<string, string>,
  ): Promise<void>
  {
    return this.open(pathname, props, query).then(context => {
      this._history.replaceState(clone(context, true), '', createUrl(context))
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
        page[1].forEach(paramHash => {
          params[paramHash[0]] = names[paramHash[1]]
        })
        return { pathname, params, page }
      }
    }
  }
}

function clone(context: RouteContext, removeFrom = false): RouteContext {
  return {
    parent: context.parent ? clone(context.parent, removeFrom) : undefined,
    from: !removeFrom && context.from ? clone(context.from, removeFrom) : undefined,
    pathname: context.pathname,
    params: context.params, // todo sharrow copy
    pattern: context.pattern,
    props: context.props, // todo sharrow copy
    query: context.query, // todo sharrow copy
  }
}

function createUrl(context: RouteContext): string {
  let params = new URLSearchParams()
  for (let key in context.query) {
    params.append(key, context.query[key])
  }
  let queryString = params.toString()
  return context.pathname + (queryString ? '?' + queryString : '')
}
