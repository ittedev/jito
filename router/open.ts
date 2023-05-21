import { router } from './router.ts'

export function open(pathname: string, props: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  return router.open(pathname, props)
}
