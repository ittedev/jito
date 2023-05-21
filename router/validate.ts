import {
  Elementable,
  Page,
  MatchedPageData,
} from './type.ts'
import { replace } from './replace.ts'
import { push } from './push.ts'

export async function validate(data: MatchedPageData, isReplace: boolean): Promise<Record<string, unknown> | undefined> {
  let props: Record<string, unknown> = {}
  for (let middleware of data.page[2]) {
    let result = await middleware({
      pathname: data.pathname,
      params: data.params,
      props,
      next: (newProps?: Record<string, unknown>) => {
        props = newProps || {}
        return true
      },
      redirect: (pathname: string, reload = false) => {
        if (reload) {
          if (isReplace) {
            replace(pathname)
          } else {
            push(pathname)
          }
        } else {
          if (isReplace) {
            location.replace(pathname)
          } else {
            location.href = pathname
          }
        }
        return false
      },
      block: () => false,
    })
    if (result !== undefined && !result) {
      return
    }
  }
  return props
}
