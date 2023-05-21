import { router } from './router.ts'
import { find, validate } from './push.ts'

export async function replace(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    let props = await validate(tupple, false)
    if (props) {
      // router.pathname = pathname
      // router.router = await getRouter(tupple[2])
      // router.params = tupple[1]
      history.replaceState({}, '', pathname)
    }
  }
}