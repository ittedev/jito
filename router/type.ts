import {
  Component,
  Module,
} from '../web_components/types.ts'

export interface PanelState {
  current: null | string | number
  panel: null | Component | Element
  page: (name: string | number, component: Component | Promise<Component> | Module | Promise<Module>) => void
  push: (name: string | number) => void
  replace: (name: string | number) => void
  back: () => void
  forward: () => void
}
