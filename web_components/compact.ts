// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { lock } from '../data_binding/lock.ts'
import { parse } from '../template_engine/parse.ts'
import { componentPlugin } from './component_plugin.ts'
import { evaluate } from '../template_engine/evaluate.ts'

evaluate.plugin(componentPlugin)

export function compact(html: string): Component
export function compact(html: string, data: Variables): Component
export function compact(html: string, data: Record<string, unknown>): Component
export function compact(html: string, construct: ComponentConstructor): Component
export function compact(template: TreeTemplate): Component
export function compact(template: TreeTemplate, data: Variables): Component
export function compact(template: TreeTemplate, data: Record<string, unknown>): Component
export function compact(template: TreeTemplate, construct: ComponentConstructor): Component
export function compact(template: string | TreeTemplate, data: Variables | Record<string, unknown> | ComponentConstructor): Component
export function compact(template: string | TreeTemplate, data: Variables | Record<string, unknown> | ComponentConstructor = []): Component {
  return lock({
    template: typeof template === 'string' ? parse(template) : template,
    data: (typeof data === 'function' || Array.isArray(data)) ? data : [data],
    options: { mode: 'open' }
  })
}
