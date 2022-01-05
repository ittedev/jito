// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { ComponentConstructor, Component } from './types.ts'
import { Variables, TreeTemplate } from '../template_engine/types.ts'
import { parse } from '../template_engine/parse.ts'
import { extend } from './extend.ts'

export function compact(html: string): Component
export function compact(html: string, stack: Variables): Component
export function compact(html: string, stack: Record<string, unknown>): Component
export function compact(html: string, construct: ComponentConstructor): Component
export function compact(template: TreeTemplate): Component
export function compact(template: TreeTemplate, stack: Variables): Component
export function compact(template: TreeTemplate, stack: Record<string, unknown>): Component
export function compact(template: TreeTemplate, construct: ComponentConstructor): Component
export function compact(template: string | TreeTemplate, stack: Variables | Record<string, unknown> | ComponentConstructor): Component
export function compact(template: string | TreeTemplate, stack: Variables | Record<string, unknown> | ComponentConstructor = []): Component {
  return {
    template: extend(typeof template === 'string' ? parse(template) : template) as TreeTemplate,
    stack: typeof stack === 'function' || Array.isArray(stack) ? stack : [stack]
  }
}
