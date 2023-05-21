import {
  Component,
  Module,
} from '../web_components/types.ts'

export type NextAction = (props?: Record<string, unknown>) => true
export type BlockAction = () => false
export type MiddlewareAction = NextAction | BlockAction
export type MiddlewareContext = {
  pathname: string,
  params: Record<string, string>,
  pattern: string,
  props: Record<string, unknown>
  next: NextAction,
  block: BlockAction,
}
export type Middleware = (context: MiddlewareContext) => void | boolean | Promise<void | boolean>
export type Pattern = string
export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, attrs?: Record<string, unknown>) => Promise<Element>
export type Elementable = Component | Promise<Component> | Module | Promise<Module> | string | Element | Promise<Element>
export type Params = [string, number][]
export type Page = [Pattern, Params, Middleware[]]
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