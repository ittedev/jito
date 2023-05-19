import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Params,
} from './type.ts'
import { pageTupples } from './router.ts'

export function page(pathname: string, component: Component): void
export function page(pathname: string, component: Promise<Component>): void
export function page(pathname: string, module: Module): void
export function page(pathname: string, module: Promise<Module>): void
export function page(
  pathname: string,
  component: Component | Promise<Component> | Module | Promise<Module>
): void
{
  let names = pathname.split('/')
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
  pages.set(key, [params, component])
}
