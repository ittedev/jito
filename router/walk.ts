import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Router,
  PageTupple,
  MatchedPageData,
  ParamHashs,
  Page,
  RouteContext,
  Elementable,
  Elementize,
  Middleware,
  MiddlewareContext,
  InputContext,
  ValueRef,
} from './type.ts'
import { MemoryHistory } from './memory_history.ts'

enum ResultType {
  Success,
  Other,
  Through,
  Fail,
}

export function walk(history: History | MemoryHistory = new MemoryHistory()): Router
{
  let router: Router
  let pageTupples: PageTupple[] = []
  let elements: Map<string, Element> = new Map<string, Element>()

  let assign = (context: RouteContext) => {
    router.pathname = context.pathname
    router.pattern = context.pattern
    router.params = context.params // todo sharrow copy
    router.props = context.props // todo sharrow copy
    router.query = context.query // todo sharrow copy
  }

  let page = (pattern: string, ...middlewares: Middleware[]) => {
    let child = walk()
    let names = pattern.split('/')
    let len = names.length
    while (pageTupples.length < len + 1) {
      pageTupples.push([new Set(), new Map()])
    }
    let kinds = pageTupples[len][0]
    let pages = pageTupples[len][1]
    let kind = names.reduce((kind, name, index) => kind | ((name[0] === ':' ? 1 : 0) << (len - 1 - index)), 0)
    let key = names.map(name => name[0] === ':' ? '*' : name).join('/')
    let params: ParamHashs = []
    names.forEach((name, index) => name[0] === ':' && params.push([name.slice(1), index]))
    kinds.add(kind)
    pageTupples[len][0] = new Set(Array.from(kinds).sort())
    pages.set(key, [
      pattern,
      params,
      middlewares,
      new TimeRef(child, undefined, ref => !!ref.size),
    ])
    return child
  }

  let section = (...middlewares: Middleware[]) =>
    (pattern: string, ...subMiddlewares: Middleware[]) =>
      page(pattern, ...middlewares, ...subMiddlewares)

  let open = (
    pathname: string,
    props?: Record<string, unknown>,
    query?: Record<string, string>,
    _unused?: unknown,
    parent?: RouteContext,
  ): Promise<RouteContext> => {
    return new Promise<RouteContext>((resolve, reject) => {
      let input = { pathname, props, query }
      ;(async () => {
        let resultType: ResultType = ResultType.Through

        let through = () => {
          resultType = ResultType.Through
        }

        let redirect = (pathname: string, props?: Record<string, unknown>, query?: Record<string, string>) => {
          open(pathname, props, query).then(resolve).catch(reject)
          resultType = ResultType.Other
        }

        for (let mutchedData of find(pathname)) {
          let contextPart = {
            parent,
            from: history.state,
            pathname: mutchedData.pathname,
            params: mutchedData.params,
            pattern: mutchedData.page[0],
          }
          let currentProps = props || {}
          let currentQuery = query || {}

          let branch = (pathname: string, props?: Record<string, unknown>, query?: Record<string, string>) => {
            let child = (mutchedData as MatchedPageData).page[3].deref() as Router
            if (child) {
              child.open(
                pathname,
                props,
                query,
                null,
                Object.assign({
                  props: currentProps, // todo sharrow copy
                  query: currentQuery, // todo sharrow copy
                }, contextPart)).then(resolve).catch(reject)
            }
            resultType = ResultType.Other
          }

          let next = (props?: Record<string, unknown>, query?: Record<string, string>) => {
            if (props) {
              currentProps = props
            }
            if (query) {
              currentQuery = query
            }
          }

          resultType = ResultType.Success
          for (let middleware of mutchedData.page[2]) {
            let context: MiddlewareContext = Object.assign({
              props: currentProps, // todo sharrow copy
              query: currentQuery, // todo sharrow copy
              next,
              redirect,
              branch,
              through,
              block: async (middleware?: Middleware) => {
                resultType = ResultType.Fail
                if (middleware) {
                  await middleware(context)
                }
                resultType = ResultType.Fail
              },
              call: async (middleware: Middleware) => await middleware(context),
            }, contextPart)

            if (await middleware(context) === false) {
              resultType = ResultType.Fail
            }

            if (resultType !== ResultType.Success) {
              break
            }
          }
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          if (resultType !== ResultType.Through) {
            if (resultType === ResultType.Success) {
              resolve({
                input,
                parent,
                from: history.state as RouteContext,
                pathname: (mutchedData as MatchedPageData).pathname,
                params: (mutchedData as MatchedPageData).params,
                pattern: (mutchedData as MatchedPageData).page[0],
                props: currentProps,
                query: currentQuery,
              })
            } else if (resultType === ResultType.Fail) {
              reject(Error('blocked'))
            }
            break
          }
        } // for

        if (resultType === ResultType.Through) {
          reject(Error('not found'))
        }
      })()
    }).then(context => {
      assign(context)
      return context
    })
  }

  let push = (
    pathname: string,
    props?: Record<string, unknown>,
    query?: Record<string, string>,
  ) =>
    open(pathname, props, query).then(context => {
      history.pushState(clone(context, true), '', createUrl(context))
    }).catch(() => {})

  let replace = (
    pathname: string,
    props?: Record<string, unknown>,
    query?: Record<string, string>,
  ) =>
    open(pathname, props, query).then(context => {
      history.replaceState(clone(context, true), '', createUrl(context))
    }).catch(() => {})

  let back = () => history.back()
  let forward = () => history.forward()
  let go = (delta: number) => history.go(delta)

  router = {
    pathname: null,
    pattern: null,
    params: {},
    props: {},
    query: {},
    panel: null,
    get size() {
      return pageTupples.reduce((count, pageTupple) => count + pageTupple[1].size, 0)
    },
    page,
    section,
    open,
    push,
    replace,
    back,
    forward,
    go,
    embed,
  }

  function* find(pathname: string): Generator<MatchedPageData> {
    let names = pathname.split('/')
    let len = names.length
    let kinds = pageTupples[len][0]
    let pages = pageTupples[len][1]
    for (let kind of kinds) {
      let key = names.map((name, index) => (1 << (len - 1 - index)) & kind ? '*' : name).join('/')
      if (pages.has(key)) {
        let page = pages.get(key) as Page
        let params: Record<string, string> = {}
        page[1].forEach(paramHash => {
          params[paramHash[0]] = names[paramHash[1]]
        })
        yield { pathname, params, page }
      }
    }
  }

  async function getElement(
    name: string,
    elementable: Elementable,
    elementize?: Elementize,
  ): Promise<Component | Module | Element> {
    if (elementize) {
      if (!elements.has(name)) {
        let elementOrComponent = await appear(elementable)
        elements.set(name, elementOrComponent instanceof Element ? elementOrComponent : await elementize(elementOrComponent))
      }
      return elements.get(name) as Element
    } else {
      return await appear(elementable)
    }
  }

  function embed(
    elementable: Elementable,
    elementize?: Elementize,
  ): Middleware
  {
    return async (context: MiddlewareContext) => {
      router.panel = await getElement(context.pattern, elementable, elementize)
    }
  }

  let listener = (event: PopStateEvent) => {
    if (event.state) {
      let context = event.state as RouteContext
      while(context.parent) {
        context = context.parent
      }
      let input = context.input as InputContext
      open(input.pathname, input.props, input.query)
    }
  }

  if (history === self.history) {
    self.addEventListener('popstate', listener)
  } else {
    // deno-lint-ignore no-explicit-any
    (history as MemoryHistory).addEventListener('popstate', listener as any)
  }

  return router
}

class TimeRef<T> implements ValueRef<T>
{
  private _ref: T | undefined

  constructor(ref: T, delay: number = 6e4, block?: (ref: T) => boolean | void)
  {
    this._ref = ref

    setTimeout(() => {
      if (this._ref) {
        if (!(block && block(this._ref))) {
          this._ref = undefined
        }
      }
    }, delay)
  }

  public deref()
  {
    return this._ref
  }
}

function clone(context: RouteContext, removeFrom = false): RouteContext {
  return {
    input: context.input,
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

async function appear(component: Elementable): Promise<Component | Module | Element> {
  if (typeof component === 'string') {
    return await import(component)
  } else {
    return await component
  }
}
