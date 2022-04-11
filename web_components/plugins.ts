// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  special,
  instanceOfComponent,
  ComponentTemplate,
  SpecialCache
} from './types.ts'
import { RealTarget, VirtualElement } from '../virtual_dom/types.ts'
import {
  Variables,
  Template,
  EvaluationTemplate,
  HasAttrTemplate,
  GroupTemplate,
  CustomElementTemplate,
  CustomTemplate,
  Cache,
  EvaluatePlugin
} from '../template_engine/types.ts'
import { ComponentElement, componentElementTag } from './elementize.ts'
import { evaluate, evaluateProps } from '../template_engine/evaluate.ts'
import { isPrimitive } from '../template_engine/is_primitive.ts'
import { pickup } from '../template_engine/pickup.ts'

type Module = {
  [Symbol.toStringTag]: 'Module'
  default?: unknown
  [prop: string]: unknown
}

export const componentPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: Variables,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      if (template.tag === componentElementTag) {
        // local entity
        return true
      }
      const temp = template as CustomElementTemplate
      const element = pickup(stack, temp.tag)[0]
      if (
        typeof element === 'object' &&
        element !== null &&
        (
          // local component
          instanceOfComponent(element) ||
            // default module
            'default' in element &&
            (element as Module)[Symbol.toStringTag] === 'Module' &&
            instanceOfComponent((element as Module).default)
        )
      ) {
        return true
      } else {
        // global component
        const El = customElements.get(temp.tag)
        return El !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, El)
      }
    }
    return false
  },

  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: Variables,
    cache: Cache
  ): VirtualElement
  {
    const temp = template as ComponentTemplate
    const ve: VirtualElement = {
      tag: componentElementTag // 'beako-entity'
    }

    let component
    if (temp.tag !== componentElementTag) {
      component = pickup(stack, temp.tag)[0]
      if (component) {
        // local component
        (ve.props ?? (ve.props = {})).component = component
      } else {
        // global component
        ve.tag = temp.tag
      }
    }

    const values = [] as Array<Template | string>
    const contents = [] as Array<[string, Template]>
    const children = (temp.children || [])?.flatMap(child => {
      if (!(typeof child === 'string')) {
        const temp = child as HasAttrTemplate
        if (temp.props) {
          if (temp.props['@as']) {
            contents.push([temp.props['@as'] as string, temp])
            return []
          } else if(temp.props.slot) {
            return [evaluate(child, stack, cache) as string | VirtualElement | number]
          }
        }
      }
      values.push(child)
      return []
    })
    if (values.length) {
      contents.push(['content', { type: 'group', children: values } as GroupTemplate])
    }
    if (contents.length) {
      if (!ve.props) {
        ve.props = {}
      }
      contents.forEach(([name, template]) => {
        (ve.props as Record<string, unknown | Template>)[name] = { type: 'evaluation', template, stack } as EvaluationTemplate
      })
    }
    if (children.length) {
      ve.children = children
    }

    evaluateProps(temp, stack, cache, ve)

    if (temp.tag === componentElementTag) {
      // local entity
      component = ve.props?.component
      ;(ve.props ?? (ve.props = {})).component = component
    }

    if (
      typeof component === 'object' &&
      component !== null &&
      'default' in component &&
      (component as Module)[Symbol.toStringTag] === 'Module' &&
      instanceOfComponent((component as Module).default)
    ) {
      // default module
      component = (component as Module).default
      ;(ve.props ?? (ve.props = {})).component = component
    }

    if (temp.cache !== component) {
      ve.new = true
    }
    temp.cache = component

    return ve
  }
} as EvaluatePlugin

export const specialTagPlugin = {
  match (
    template: CustomElementTemplate,
    stack: Variables,
    cache: SpecialCache
  ): boolean
  {
    if (template.type === 'custom') {
      if (special in cache && !isPrimitive(template.tag)) {
        // console.log('cache:', cache)
        const el = pickup(stack, template.tag)[0]
        return cache[special].some(tag => tag === el)
      }
    }
    return false
  },

  exec (
    template: CustomElementTemplate,
    stack: Variables,
    cache: Cache
  ): RealTarget
  {
    const el = pickup(stack, template.tag)[0] as Element || ShadowRoot
    const re = {
      el,
      invalid: {
        props: true,
        children: true
      }
    }
    evaluateProps(template, stack, cache, re)
    return re
  }
} as EvaluatePlugin
