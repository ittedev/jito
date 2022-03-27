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
import { ComponentElement, localComponentElementTag } from './element.ts'
import { evaluate, evaluateProps } from '../template_engine/evaluate.ts'
import { isPrimitive } from '../template_engine/is_primitive.ts'
import { pickup } from '../template_engine/pickup.ts'

export const componentPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: Variables,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      if (template.tag === 'entity') {
        return true
      }
      const temp = template as CustomElementTemplate
      // local or global component
      const element = pickup(stack, temp.tag)[0]
      if (instanceOfComponent(element)) {
        return true
      } else {
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
    const el = { tag: template.tag } as VirtualElement

    el.tag = localComponentElementTag // 'beako-entity'
    if (temp.tag === 'entity' || temp.tag === localComponentElementTag) {
      el.props = { component: temp.props?.component }
    } else {
      const element = pickup(stack, temp.tag)[0]
      if (element) {
        el.props = { component: element }
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
      if (!el.props) {
        el.props = {}
      }
      contents.forEach(([name, template]) => {
        (el.props as Record<string, unknown | Template>)[name] = { type: 'evaluation', template, stack } as EvaluationTemplate
      })
    }
    if (children.length) {
      el.children = children
    }

    evaluateProps(temp, stack, cache, el)
    if (temp.cache !== el.props?.component) {
      el.new = true
    }
    temp.cache = el.props?.component

    return el
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
