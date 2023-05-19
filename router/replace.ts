import { find } from './push.ts'
import { router } from './router.ts'

export function replace(pathname: string): void {
  let tupple = find(pathname)
  if (tupple) {
    router.pathname = pathname
    router.router = tupple[0]
    router.params = tupple[1]
    history.replaceState({}, '', pathname)
  }
}