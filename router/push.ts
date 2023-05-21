import { router } from './router.ts'

export function push(pathname: string): Promise<void> {
  return router.push(pathname)
}
