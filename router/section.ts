import type {
  Middleware,
  SetPage,
  Elementable,
  Elementize,
} from './type.ts'
import { page } from './page.ts'

export function section(...middlewares: Middleware[]): SetPage {
  return function (
    pattern: string,
    orMiddlewares: Middleware[] | Elementable,
    orComponent?: Elementable | Elementize,
    elementizable?: Elementize,
  ) {
    let subMiddlewares = Array.isArray(orMiddlewares) ? orMiddlewares : []
    let component = Array.isArray(orMiddlewares) ? orComponent as Elementable : orMiddlewares
    let elementize = Array.isArray(orMiddlewares) ? elementizable : orComponent as Elementize
    return page(pattern, [...middlewares, ...subMiddlewares], component as string, elementize)
  }
}
