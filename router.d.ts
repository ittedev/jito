// deno-lint-ignore-file no-explicit-any
import {
  Component,
  Module,
} from './jito.d.ts'

export type MemoryHistoryStateEvent = {
  type: 'reload' | 'popstate',
  state: any,
  stopImmediatePropagation: () => void
}

export class MemoryHistory implements History {
  public scrollRestoration: 'auto' | 'manual'
  public get length(): number
  public get state(): any
  public go(delta: number): void
  public back(): void
  public forward(): void
  public pushState(state: any): void
  public replaceState(state: any): void
  public addEventListener(type: 'reload' | 'popstate', listener: (event: MemoryHistoryStateEvent) => void): void
  public removeEventListener(type: 'reload' | 'popstate', listener: (event: MemoryHistoryStateEvent) => void): void
}

export type Elementize = (component: Component | Promise<Component> | Module | Promise<Module> | string, props?: Record<string, unknown>) => Promise<Element>

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

export interface RouteContext extends PageContext {
  parent: RouteContext | undefined
  from: RouteContext | undefined
}

export interface MiddlewareContext extends RouteContext {
  pathname: string
  pattern: string
  next: (props?: Record<string, unknown>, query?: Record<string, string>) => true
  redirect: (pathname: string) => false
  branch: (pathname: string) => false
  block: () => false,
  call: (middleware: Middleware) => void
}

export type Middleware = (context: MiddlewareContext) => void | boolean | Promise<void | boolean>

export interface CoreRouter extends PageContext {
  size: number,
  page: (pattern: string, ...middlewares: Middleware[]) => Router
  section: (...middlewares: Middleware[]) => (pattern: string, ...middlewares: Middleware[]) => Router
  open: (pathname: string, props?: Record<string, unknown>, query?: Record<string, string>) => Promise<RouteContext>
  push: (pathname: string, props?: Record<string, unknown>, query?: Record<string, string>) => Promise<void>
  replace: (pathname: string, props?: Record<string, unknown>, query?: Record<string, string>) => Promise<void>
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

export function walk(history?: History | MemoryHistory): Router
