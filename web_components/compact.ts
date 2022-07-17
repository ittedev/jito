import { Main, Component, Patcher } from './types.ts'
import { StateStack, TreeTemplate } from '../template_engine/types.ts'
import { lock } from '../data_binding/lock.ts'
import { parse } from '../template_engine/parse.ts'
import { componentPlugin, specialTagPlugin } from './plugins.ts'
import { evaluate } from '../template_engine/evaluate.ts'

evaluate.plugin(componentPlugin)
evaluate.plugin(specialTagPlugin)

export function compact(html: string): Component
export function compact(html: string, stack: StateStack): Component
export function compact(html: string, state: Record<string, unknown>): Component
export function compact(html: string, main: Main): Component
export function compact(template: TreeTemplate): Component
export function compact(template: TreeTemplate, stack: StateStack): Component
export function compact(template: TreeTemplate, state: Record<string, unknown>): Component
export function compact(template: TreeTemplate, main: Main): Component
export function compact(patcher: Patcher): Component
export function compact(patcher: Patcher, stack: StateStack): Component
export function compact(patcher: Patcher, state: Record<string, unknown>): Component
export function compact(patcher: Patcher, main: Main): Component
export function compact(template: string | TreeTemplate | Patcher, main: StateStack | Record<string, unknown> | Main): Component
export function compact(
  template: string | TreeTemplate | Patcher,
  main: StateStack | Record<string, unknown> | Main = []
): Component
{
  let component: Component = {
    main: (typeof main === 'function' || Array.isArray(main)) ? main : [main],
    options: { mode: 'open' }
  }

  if (typeof template === 'function') {
    component.patcher = template
  } else {
    component.template = typeof template === 'string' ? parse(template) : template
  }

  return lock(component)
}
