import {
  Component,
  instanceOfComponent,
  Module,
  instanceOfModule
} from './types.ts'
import { componentElementTag, ComponentElement } from './element.ts'

export async function elementize(component: Component): Promise<Element>
export async function elementize(component: Component, attrs: Record<string, unknown>): Promise<Element>
export async function elementize(component: Promise<Component>): Promise<Element>
export async function elementize(component: Promise<Component>, attrs: Record<string, unknown>): Promise<Element>
export async function elementize(module: Module): Promise<Element>
export async function elementize(module: Module, attrs: Record<string, unknown>): Promise<Element>
export async function elementize(module: Promise<Module>): Promise<Element>
export async function elementize(module: Promise<Module>, attrs: Record<string, unknown>): Promise<Element>
export async function elementize(tag: string): Promise<Element>
export async function elementize(tag: string, attrs: Record<string, unknown>): Promise<Element>
export async function elementize(component: Component | Promise<Component> | Module | Promise<Module> | string, attrs?: Record<string, unknown>): Promise<Element>
{
  // Createm Element
  let el
  if (typeof component === 'string') {
    el = document.createElement(component) as ComponentElement
  } else {
    el = document.createElement(componentElementTag) as ComponentElement
    let result = await Promise.resolve(component)
    let attr =
      instanceOfModule(result) && instanceOfComponent(result.default) ?
        result.default as unknown as string :
        result as unknown as string
    el.setAttribute('component', attr)
  }

  // Set attrs
  if (attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key])
    }
  }

  // Wait runninng
  if (typeof component === 'string') {
    let El = customElements.get(component)
    if (El !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, El)) {
      await el.ready()
    }
  } else {
    await el.ready()
  }

  return el
}
