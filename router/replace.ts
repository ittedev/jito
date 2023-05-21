import { open } from './open.ts'

export function replace(pathname: string): Promise<void> {
  return open(pathname).then(props => {
    // router.pathname = pathname
    // router.router = await getRouter(tupple[2])
    // router.params = tupple[1]
    history.replaceState({}, '', pathname)
  }).catch(() => {})
}