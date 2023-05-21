import {
  Component,
  Module,
} from '../web_components/types.ts'
import {
  Elementable,
  Elementize,
  Middleware,
} from './type.ts'
import { panel } from './panel.ts'

export function embed(component: Component, elementize?: Elementize): Middleware
export function embed(component: Promise<Component>, elementize?: Elementize): Middleware
export function embed(module: Module, elementize?: Elementize): Middleware
export function embed(module: Promise<Module>, elementize?: Elementize): Middleware
export function embed(filePath: string, elementize?: Elementize): Middleware
export function embed(element: Element, elementize?: Elementize): Middleware
export function embed(element: Promise<Element>, elementize?: Elementize): Middleware
export function embed(
  elementable: Elementable,
  elementize?: Elementize,
): Middleware
{
  return panel.embed(elementable as Element, elementize)
}