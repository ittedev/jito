import {
  Component,
  Module,
} from '../web_components/types.ts'
import type { Router } from './walk.ts'
import type { TimeRef } from './time_ref.ts'

export interface RouteContext {
  parent: RouteContext | undefined
  from: RouteContext | undefined
  pathname: string
  pattern: string
  params: Record<string, string>
  props: Record<string, unknown>
  query: Record<string, string>
}

export interface MiddlewareContext extends RouteContext {
  next: (props?: Record<string, unknown>) => true
  redirect: (pathname: string) => false
  branch: (pathname: string) => false
  block: () => false,
  call: (middleware: Middleware) => void
}

export type Middleware = (context: MiddlewareContext) => void | boolean | Promise<void | boolean>
export type Pattern = string
export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, props?: Record<string, unknown>) => Promise<Element>
export type Elementable = Component | Promise<Component> | Module | Promise<Module> | string | Element | Promise<Element>
export type ParamHashs = [string, number][]
export type Page = [Pattern, ParamHashs, Middleware[], TimeRef<Router>]
export type Kinds = Set<number>
export type Pages = Map<string, Page>
export type PageTupple = [Kinds, Pages]
export type MatchedPageData = {
  pathname: string,
  params: Record<string, string>,
  page: Page,
}

export type SetPage = (pathname: string, ...middlewares: Middleware[]) => void

export type MemoryHistoryStateEvent = {
  type: 'reload' | 'popstate',
  state: any,
  stopImmediatePropagation: () => void
}
