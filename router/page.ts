import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Middleware,
  Elementize,
  Elementable,
  Params,
} from './type.ts'
import { pageTupples } from './router.ts'
import { find, getRouter, validate } from './push.ts'
import { router } from './router.ts'

export function page(pattern: string, component: Component, elementize?: Elementize): void
export function page(pattern: string, component: Promise<Component>, elementize?: Elementize): void
export function page(pattern: string, module: Module, elementize?: Elementize): void
export function page(pattern: string, module: Promise<Module>, elementize?: Elementize): void
export function page(pattern: string, filePath: string, elementize?: Elementize): void
export function page(pattern: string, element: Element, elementize?: Elementize): void
export function page(pattern: string, element: Promise<Element>, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], component: Component, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], component: Promise<Component>, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], module: Module, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], module: Promise<Module>, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], filePath: string, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], element: Element, elementize?: Elementize): void
export function page(pattern: string, middlewares: Middleware[], element: Promise<Element>, elementize?: Elementize): void
export function page(
  pattern: string,
  orMiddlewares: Middleware[] | Elementable,
  orComponent?: Elementable | Elementize,
  elementizable?: Elementize,
): void
{
  let middlewares = Array.isArray(orMiddlewares) ? orMiddlewares : []
  let component = Array.isArray(orMiddlewares) ? orComponent as Elementable : orMiddlewares
  let elementize = Array.isArray(orMiddlewares) ? elementizable : orComponent as Elementize

  let names = pattern.split('/')
  let len = names.length
  while (pageTupples.length < len + 1) {
    pageTupples.push([new Set(), new Map()])
  }
  let kinds = pageTupples[len][0]
  let pages = pageTupples[len][1]
  let kind = names.reduce((kind, name, index) => kind | ((name[0] === ':' ? 1 : 0) << (len - 1 - index)), 0)
  let key = names.map(name => name[0] === ':' ? '*' : name).join('/')
  let params: Params = []
  names.forEach((name, index) => name[0] === ':' && params.push([name.slice(1), index]))
  kinds.add(kind)
  pageTupples[len][0] = new Set(Array.from(kinds).sort())
  pages.set(key, [pattern, params, middlewares, component, elementize])
}

self.addEventListener('popstate', async () => {
  let tupple = find(location.pathname)
  if (tupple) {
    let props = await validate(tupple, false)
    if (props) {
      router.pathname = location.pathname
      router.router = await getRouter(tupple[2])
      router.params = tupple[1]
    }
  }
})
