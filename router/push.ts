import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Elementable,
} from './type.ts'
import { find } from './find.ts'
import { validate } from './validate.ts'

export async function push(pathname: string): Promise<void> {
  let tupple = find(pathname)
  if (tupple) {
    let props = await validate(tupple, false)
    if (props) {
      // router.pathname = pathname
      // router.router = await getRouter(tupple[2])
      // router.params = tupple[1]
      history.pushState({}, '', pathname)
    }
  }
}

export async function appear(component: Elementable): Promise<Component | Module | Element> {
  if (typeof component === 'string') {
    return await import(component)
  } else {
    return await component
  }
}

// export async function getRouter(page: Page): Promise<Component | Module | Element> {
//   if (page[4]) {
//     if (!elementHolder.has(page[0])) {
//       let elementable = await appear(page[3])
//       elementHolder.set(page[0], elementable instanceof Element ? elementable : await page[4](elementable))
//     }
//     return elementHolder.get(page[0]) as Element
//   } else {
//     return await appear(page[3])
//   }
// }


