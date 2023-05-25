import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Panel,
  Elementable,
  Elementize,
  Middleware,
  MiddlewareContext,
} from './type.ts'

export function createPanel() {
  let elements: Map<string, Element> = new Map<string, Element>()

  async function getElement(
    name: string,
    elementable: Elementable,
    elementize?: Elementize,
  ): Promise<Component | Module | Element> {
    if (elementize) {
      if (!elements.has(name)) {
        let elementOrComponent = await appear(elementable)
        elements.set(name, elementOrComponent instanceof Element ? elementOrComponent : await elementize(elementOrComponent))
      }
      return elements.get(name) as Element
    } else {
      return await appear(elementable)
    }
  }

  let panel = {
    pathname: '',
    params: {},
    panel: null,
  } as Panel

  function embed(component: Component, elementize?: Elementize): Middleware
  function embed(component: Promise<Component>, elementize?: Elementize): Middleware
  function embed(module: Module, elementize?: Elementize): Middleware
  function embed(module: Promise<Module>, elementize?: Elementize): Middleware
  function embed(filePath: string, elementize?: Elementize): Middleware
  function embed(element: Element, elementize?: Elementize): Middleware
  function embed(element: Promise<Element>, elementize?: Elementize): Middleware
  function embed(
    elementable: Elementable,
    elementize?: Elementize,
  ): Middleware
  {
    return async (context: MiddlewareContext) => {
      panel.pathname = context.pathname
      panel.panel = await getElement(context.pattern, elementable, elementize)
      panel.params = Object.assign({}, context.params, context.query, context.props)
    }
  }

  panel.embed = embed

  return panel
}

async function appear(component: Elementable): Promise<Component | Module | Element> {
  if (typeof component === 'string') {
    return await import(component)
  } else {
    return await component
  }
}
