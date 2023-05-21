import {
  Middleware,
} from './type.ts'
import { router } from './router.ts'

export function page(pattern: string, ...middlewares: Middleware[]): void
{
  router.page(pattern, ...middlewares)
}
