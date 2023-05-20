import {
  Component,
  Module,
} from '../web_components/types.ts'

export type Pattern = string
export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, attrs?: Record<string, unknown>) => Promise<Element>
export type Elementable = Component | Promise<Component> | Module | Promise<Module> | string | Element | Promise<Element>
export type Params = [string, number][]
export type Page = [Pattern, Params, Elementable, Elementize | undefined]
export type Kinds = Set<number>
export type Pages = Map<string, Page>
export type PageTupple = [Kinds, Pages]

export type PanelName = string | number
export type PanelPage = [Elementable, Elementize | undefined]

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
  push: (name: PanelName) => void
  replace: (name: PanelName) => void
  back: () => void
  forward: () => void
}

export interface Router {
  pathname: null | string
  router: null | Component | Module | Element
  params: Record<string, string>
  page: ((pathname: string, component: Component, elementize?: Elementize) => void)
    | ((pathname: string, component: Promise<Component>, elementize?: Elementize) => void)
    | ((pathname: string, module: Module, elementize?: Elementize) => void)
    | ((pathname: string, module: Promise<Module>, elementize?: Elementize) => void)
    | ((pathname: string, filePath: string, elementize?: Elementize) => void)
    | ((pathname: string, element: Element) => void)
    | ((pathname: string, element: Promise<Element>) => void)
  push: (pathname: string) => Promise<void>
  replace: (pathname: string) => Promise<void>
  back: () => void
  forward: () => void
}