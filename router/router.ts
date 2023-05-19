import {
  PageTupple,
  Router,
} from './type.ts'
import { page } from './page.ts'
import { push } from './push.ts'
import { back } from './back.ts'
import { forward } from './forward.ts'

export let pageTupples: PageTupple[] = []
export let leftHistoryQueue: string[] = []
export let rightHistoryQueue: string[] = []

export let router: Router = {
  pathname: null,
  router: null,
  params: {},
  page,
  push,
  back,
  forward,
}
