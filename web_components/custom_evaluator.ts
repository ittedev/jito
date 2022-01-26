// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { EvaluationTemplate, CustomElementTemplate, Component, instanceOfComponent } from './types.ts'
import { VirtualElement } from '../virtual_dom/types.ts'
import {
  Variables,
  Evaluate,
  Template,
  ElementTemplate,
  HasAttrTemplate,
  GroupTemplate,
  Cache
} from '../template_engine/types.ts'
import { evaluate, evaluator, evaluateProps } from '../template_engine/evaluate.ts'
import { ComponentElement, localComponentElementTag } from './element.ts'
import { isPrimitive } from './is_primitive.ts'

evaluator.evaluation = (
  (template: EvaluationTemplate, stack: Variables, cache: Cache): unknown =>
    evaluate(
      template.template,
      template.stack ? template.stack.concat(stack) : stack,
      cache
    )
) as Evaluate

evaluator.custom = (
  (template: CustomElementTemplate, stack: Variables, cache: Cache): VirtualElement => {
    const el = { tag: template.tag } as VirtualElement

    if (template.is) {
      el.is = typeof template.is === 'string' ? template.is : evaluate(template.is, stack, cache) as string
    }

    let isComponent: boolean
    if (!template.isForce) {
      if (isPrimitive(template as ElementTemplate)) {
        const Type = customElements.get(el.is as string)
        isComponent = Type !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, Type)
      } else {
        // local or global component
        let element: unknown
        for (let i = stack.length - 1; i >= 0; i--) {
          if (template.tag in stack[i]) {
            element = stack[i][template.tag]
            break
          }
        }
        if (instanceOfComponent(element)) {
          el.tag = localComponentElementTag
          el.props = { component: element }
          isComponent = true
        } else {
          const Type = customElements.get(template.tag)
          isComponent = Type !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, Type)
        }
      }
    } else {
      isComponent = true
    }

    if (isComponent) {
      const values = [] as Array<Template | string>
      const contents = [] as Array<[string, Template]>
      const children = (template.children || [])?.flatMap(child => {
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

      evaluateProps(template as ElementTemplate, stack, cache, el)
      if (template.cache && template.cache !== el.props?.component) {
        el.new = true
      }
      if (el.props?.component) {
        template.cache = el.props.component as Component
      } else {
        delete template.cache
      }

      return el
  } else {
    return evaluator.element(template as ElementTemplate, stack, cache) as VirtualElement
  }
}) as Evaluate
