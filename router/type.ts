import {
  Component,
  Module,
} from '../web_components/types.ts'

export type NextAction = (props?: Record<string, unknown>) => true
export type RedirectAction = (pathname: string, reload?: boolean) => false
export type BlockAction = () => false
export type MiddlewareAction = NextAction | RedirectAction | BlockAction
export type MiddlewareContext = {
  pathname: string,
  params: Record<string, string>,
  props: Record<string, unknown>
  next: NextAction,
  redirect: RedirectAction,
  block: BlockAction,
}
export type Middleware = (context: MiddlewareContext) => void | boolean | Promise<void | boolean>
export type Pattern = string
export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, attrs?: Record<string, unknown>) => Promise<Element>
export type Elementable = Component | Promise<Component> | Module | Promise<Module> | string | Element | Promise<Element>
export type Params = [string, number][]
export type Page = [Pattern, Params, Middleware[], Elementable, Elementize | undefined]
export type Kinds = Set<number>
export type Pages = Map<string, Page>
export type PageTupple = [Kinds, Pages]
export type MatchedPageTupple = [string, Record<string, string>, Page]

export type SetPage = ((pathname: string, component: Component, elementize?: Elementize) => void)
  | ((pathname: string, component: Promise<Component>, elementize?: Elementize) => void)
  | ((pathname: string, module: Module, elementize?: Elementize) => void)
  | ((pathname: string, module: Promise<Module>, elementize?: Elementize) => void)
  | ((pathname: string, filePath: string, elementize?: Elementize) => void)
  | ((pathname: string, element: Element) => void)
  | ((pathname: string, element: Promise<Element>) => void)
  | ((pathname: string, middlewares: Middleware[], component: Component, elementize?: Elementize) => void)
  | ((pathname: string, middlewares: Middleware[], component: Promise<Component>, elementize?: Elementize) => void)
  | ((pathname: string, middlewares: Middleware[], module: Module, elementize?: Elementize) => void)
  | ((pathname: string, middlewares: Middleware[], module: Promise<Module>, elementize?: Elementize) => void)
  | ((pathname: string, middlewares: Middleware[], filePath: string, elementize?: Elementize) => void)
  | ((pathname: string, middlewares: Middleware[], element: Element) => void)
  | ((pathname: string, middlewares: Middleware[], element: Promise<Element>) => void)

export interface Router {
  pathname: null | string
  router: null | Component | Module | Element
  params: Record<string, string>
  page: SetPage
  push: (pathname: string) => Promise<void>
  replace: (pathname: string) => Promise<void>
  back: () => void
  forward: () => void
}

export type PanelName = string | number
export type PanelRedirectAction = (name: PanelName) => false
export type PanelMiddleware = (context: PanelMiddlewareContext) => void | boolean | Promise<void | boolean>
export type PanelMiddlewareContext = {
  name: PanelName,
  props: Record<string, unknown>
  next: NextAction,
  redirect: PanelRedirectAction,
  block: BlockAction,
}
export type PanelPage = [PanelMiddleware[], Elementable, Elementize | undefined]
export type MatchedPanelTupple = [PanelName, PanelPage]

export interface Panel {
  current: null | PanelName
  panel: null | Component | Module | Element
  page: ((name: PanelName, component: Component, elementize?: Elementize) => void)
    | ((name: PanelName, component: Promise<Component>, elementize?: Elementize) => void)
    | ((name: PanelName, module: Module, elementize?: Elementize) => void)
    | ((name: PanelName, module: Promise<Module>, elementize?: Elementize) => void)
    | ((name: PanelName, filePath: string, elementize?: Elementize) => void)
    | ((name: PanelName, element: Element) => void)
    | ((name: PanelName, element: Promise<Element>) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], component: Component, elementize?: Elementize) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], component: Promise<Component>, elementize?: Elementize) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], module: Module, elementize?: Elementize) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], module: Promise<Module>, elementize?: Elementize) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], filePath: string, elementize?: Elementize) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], element: Element) => void)
    | ((name: PanelName, middlewares: PanelMiddleware[], element: Promise<Element>) => void)
  push: (name: PanelName) => Promise<void>
  replace: (name: PanelName) => Promise<void>
  back: () => void
  forward: () => void
}