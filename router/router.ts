import {
  PageTupple,
  Router,
} from './type.ts'
import { page } from './page.ts'
import { push } from './push.ts'

export let pageTupples: PageTupple[] = []

export let router: Router = {
  pathname: null,
  router: null,
  params: {},
  page,
  push,
}
