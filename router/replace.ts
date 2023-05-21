import { router } from './router.ts'

export function replace(pathname: string): Promise<void> {
  return router.replace(pathname)
}