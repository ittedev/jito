import {
  Component,
  Module,
} from '../web_components/types.ts'

export interface NextOptions {
  props?: Record<string, unknown>
  query?: Record<string, string>
}

export interface PageContext {
  pathname: string | null
  pattern: string | null
  params: Record<string, string>
  props: Record<string, unknown>
  query: Record<string, string>
}

export interface CoreRouter extends PageContext {
  size: number,
  page: (pattern: string, ...middlewares: Middleware[]) => Router
  section: (...middlewares: Middleware[]) => (pattern: string, ...middlewares: Middleware[]) => Router
  open: (pathname: string, options?: NextOptions) => Promise<RouteContext>
  push: (pathname: string, options?: NextOptions) => Promise<void>
  replace: (pathname: string, options?: NextOptions) => Promise<void>
  back: () => void
  forward: () => void
}

export interface Panel {
  panel: null | Component | Module | Element
  embed:
    ((component: Component, elementize?: Elementize) => Middleware) |
    ((component: Promise<Component>, elementize?: Elementize) => Middleware) |
    ((module: Module, elementize?: Elementize) => Middleware) |
    ((module: Promise<Module>, elementize?: Elementize) => Middleware) |
    ((filePath: string, elementize?: Elementize) => Middleware) |
    ((element: Element, elementize?: Elementize) => Middleware) |
    ((element: Promise<Element>, elementize?: Elementize) => Middleware)
}

export interface Router extends CoreRouter, Panel {}

export interface RouteContext extends PageContext {
  parent: RouteContext | undefined
  from: RouteContext | undefined
}

export interface MiddlewareContext extends RouteContext {
  pathname: string
  pattern: string
  next: (options?: NextOptions) => true
  redirect: (pathname: string) => false
  branch: (pathname: string) => false
  block: () => false,
  call: (middleware: Middleware) => void
}

export interface ValueRef<T> {
  deref(): T | undefined
}

export type Middleware = (context: MiddlewareContext) => void | boolean | Promise<void | boolean>
export type Pattern = string
export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, props?: Record<string, unknown>) => Promise<Element>
export type Elementable = Component | Promise<Component> | Module | Promise<Module> | string | Element | Promise<Element>
export type ParamHashs = [string, number][]
export type Page = [Pattern, ParamHashs, Middleware[], ValueRef<Router>]
export type Kinds = Set<number>
export type Pages = Map<string, Page>
export type PageTupple = [Kinds, Pages]
export type MatchedPageData = {
  pathname: string,
  params: Record<string, string>,
  page: Page,
}

export type MemoryHistoryStateEvent = {
  type: 'reload' | 'popstate',
  // deno-lint-ignore no-explicit-any
  state: any,
  stopImmediatePropagation: () => void
}
