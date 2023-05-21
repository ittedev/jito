import type {
  Middleware,
  SetPage,
} from './type.ts'
import { page } from './page.ts'

export function section(...middlewares: Middleware[]): SetPage {
  return function (
    pattern: string,
    ...subMiddlewares: Middleware[]
  ) {
    return page(pattern, ...middlewares, ...subMiddlewares)
  }
}
