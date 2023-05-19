import { find, appear } from './push.ts'
import { router } from './router.ts'

export async function replace(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    router.pathname = pathname
    router.router = await appear(tupple[0])
    router.params = tupple[1]
    history.replaceState({}, '', pathname)
  }
}