import {
  Component,
  Module,
} from '../web_components/types.ts'

export type Elementable = Component | Promise<Component> | Module | Promise<Module>
export type Params = [string, number][]
export type Page = [Params, Component | Promise<Component> | Module | Promise<Module>]
export type Kinds = Set<number>
export type Pages = Map<string, Page>
export type PageTupple = [Kinds, Pages]

export interface Panel {
  current: null | string | number
  panel: null | Component | Element
  page: (name: string | number, component: Component | Promise<Component> | Module | Promise<Module>) => void
  push: (name: string | number) => void
  replace: (name: string | number) => void
  back: () => void
  forward: () => void
}

export interface Router {
  pathname: null | string
  router: null | Component | Module | Element
  params: Record<string, string>
  page: ((pathname: string, component: Component) => void)
    | ((pathname: string, component: Promise<Component>) => void)
    | ((pathname: string, module: Module) => void)
    | ((pathname: string, module: Promise<Module>) => void)
  push: (pathname: string) => Promise<void>
  replace: (pathname: string) => Promise<void>
  back: () => void
  forward: () => void
}