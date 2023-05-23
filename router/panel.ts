import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Elementable,
  Elementize,
  Middleware,
  MiddlewareContext,
} from './type.ts'

export class Panel {
  private _elements: Map<string, Element> = new Map<string, Element>()
  public pathname: string = ''
  public params: Record<string, string> = {}
  public panel: null | Component | Module | Element = null

  public embed(component: Component, elementize?: Elementize): Middleware
  public embed(component: Promise<Component>, elementize?: Elementize): Middleware
  public embed(module: Module, elementize?: Elementize): Middleware
  public embed(module: Promise<Module>, elementize?: Elementize): Middleware
  public embed(filePath: string, elementize?: Elementize): Middleware
  public embed(element: Element, elementize?: Elementize): Middleware
  public embed(element: Promise<Element>, elementize?: Elementize): Middleware
  public embed(
    elementable: Elementable,
    elementize?: Elementize,
  ): Middleware
  {
    return async (context: MiddlewareContext) => {
      this.pathname = context.pathname
      this.panel = await this.getElement(context.pattern, elementable, elementize)
      this.params = Object.assign({}, context.params, context.query, context.props)
    }
  }

  private async getElement(
    name: string,
    elementable: Elementable,
    elementize?: Elementize,
  ): Promise<Component | Module | Element> {
    if (elementize) {
      if (!this._elements.has(name)) {
        let elementOrComponent = await appear(elementable)
        this._elements.set(name, elementOrComponent instanceof Element ? elementOrComponent : await elementize(elementOrComponent))
      }
      return this._elements.get(name) as Element
    } else {
      return await appear(elementable)
    }
  }
}

async function appear(component: Elementable): Promise<Component | Module | Element> {
  if (typeof component === 'string') {
    return await import(component)
  } else {
    return await component
  }
}
