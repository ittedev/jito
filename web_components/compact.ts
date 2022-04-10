// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Main, Component, Patcher } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { lock } from '../data_binding/lock.ts'
import { parse } from '../template_engine/parse.ts'
import { componentPlugin, specialTagPlugin } from './plugins.ts'
import { evaluate } from '../template_engine/evaluate.ts'

evaluate.plugin(componentPlugin)
evaluate.plugin(specialTagPlugin)

export function compact(html: string): Component
export function compact(html: string, data: Variables): Component
export function compact(html: string, data: Record<string, unknown>): Component
export function compact(html: string, main: Main): Component
export function compact(template: TreeTemplate): Component
export function compact(template: TreeTemplate, data: Variables): Component
export function compact(template: TreeTemplate, data: Record<string, unknown>): Component
export function compact(template: TreeTemplate, main: Main): Component
export function compact(patcher: Patcher): Component
export function compact(patcher: Patcher, data: Variables): Component
export function compact(patcher: Patcher, data: Record<string, unknown>): Component
export function compact(patcher: Patcher, main: Main): Component
export function compact(template: string | TreeTemplate | Patcher, data: Variables | Record<string, unknown> | Main): Component
export function compact(
  template: string | TreeTemplate | Patcher,
  data: Variables | Record<string, unknown> | Main = []
): Component
{
  const component: Component = {
    data: (typeof data === 'function' || Array.isArray(data)) ? data : [data],
    options: { mode: 'open' }
  }

  if (typeof template === 'function') {
    component.patcher = template
  } else {
    component.template = typeof template === 'string' ? parse(template) : template
  }

  return lock(component)
}
