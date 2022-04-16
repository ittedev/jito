// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import {
  special,
  instanceOfComponent,
  ComponentTemplate,
  SpecialCache,
  Module,
  instanceOfModule
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
import { ComponentElement, componentElementTag } from './element.ts'
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
      if (template.tag === componentElementTag || template.tag === 'element') {
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
          instanceOfModule(element) && instanceOfComponent(element.default)
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
      tag: componentElementTag // 'beako-element'
    }

    let component

    // If tag is not "beako-element"
    if (temp.tag !== componentElementTag && temp.tag !== 'element') {
      component = pickup(stack, temp.tag)[0]
      if (component) {
        // If local component,
        // set a component property
        (ve.props ??= {}).component = component
      } else {
        // If global component,
        // don't change the tag
        ve.tag = temp.tag
      }
    }

    // Resolve properties
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

    // If tag is "beako-element",
    // require a component property
    // because attach shadow error occurs
    if (temp.tag === componentElementTag || temp.tag === 'element') {
      component = ve.props?.component
      ;(ve.props ??= {}).component = component
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
      ;(ve.props ??= {}).component = component
    }

    // Create new element,
    // to avoid attach shadow error
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
