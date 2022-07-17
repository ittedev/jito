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
  StateStack,
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
import { evaluate, evaluateAttrs } from '../template_engine/evaluate.ts'
import { isPrimitive } from '../template_engine/is_primitive.ts'
import { pickup } from '../template_engine/pickup.ts'

export let componentPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      if (template.tag === componentElementTag) {
        // local entity
        return true
      }
      let temp = template as CustomElementTemplate
      let element = pickup(stack, temp.tag)
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
        let El = customElements.get(temp.tag)
        return El !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, El)
      }
    }
    return false
  },

  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    cache: Cache
  ): VirtualElement
  {
    let temp = template as ComponentTemplate
    let ve: VirtualElement = {
      tag: componentElementTag // 'beako-element'
    }

    let component

    // If tag is not "beako-element"
    if (temp.tag !== componentElementTag ) {
      component = pickup(stack, temp.tag)
      if (component) {
        // If local component,
        // set a component property
        (ve.attrs ??= {}).component = component
      } else {
        // If global component,
        // don't change the tag
        ve.tag = temp.tag
      }
    }

    // Resolve properties
    let values = [] as Array<Template | string>
    let contents = [] as Array<[string, Template]>
    let children = (temp.children || [])?.flatMap(child => {
      if (!(typeof child === 'string')) {
        let temp = child as HasAttrTemplate
        if (temp.attrs) {
          if (temp.attrs['@as']) {
            contents.push([temp.attrs['@as'] as string, temp])
            return []
          } else if(temp.attrs.slot) {
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
      if (!ve.attrs) {
        ve.attrs = {}
      }
      contents.forEach(([name, template]) => {
        (ve.attrs as Record<string, unknown | Template>)[name] = { type: 'evaluation', template, stack } as EvaluationTemplate
      })
    }
    if (children.length) {
      ve.children = children
    }

    evaluateAttrs(temp, stack, cache, ve)

    // If tag is "beako-element",
    // require a component property
    // because attach shadow error occurs
    if (temp.tag === componentElementTag) {
      component = ve.attrs?.component
      ;(ve.attrs ??= {}).component = component
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
      ;(ve.attrs ??= {}).component = component
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

export let specialTagPlugin = {
  match (
    template: CustomElementTemplate,
    stack: StateStack,
    cache: SpecialCache
  ): boolean
  {
    if (template.type === 'custom') {
      if (special in cache && !isPrimitive(template.tag)) {
        let el = pickup(stack, template.tag)
        return cache[special].some(tag => tag === el)
      }
    }
    return false
  },

  exec (
    template: CustomElementTemplate,
    stack: StateStack,
    cache: Cache
  ): RealTarget
  {
    let el = pickup(stack, template.tag) as Element || ShadowRoot
    let re = {
      el,
      override: true,
      invalid: {
        attrs: true,
        children: true
      }
    }
    evaluateAttrs(template, stack, cache, re)
    return re
  }
} as EvaluatePlugin
