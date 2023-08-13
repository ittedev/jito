// deno-lint-ignore-file no-explicit-any
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
import { evaluate, evaluateAttrs, evaluateChildren } from '../template_engine/evaluate.ts'
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
      let tagChain = temp.tag.split('.')
      let element = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0]))
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
      tag: componentElementTag // 'jito-element'
    }

    let component

    // If tag is not "jito-element"
    if (temp.tag !== componentElementTag ) {
      let tagChain = temp.tag.split('.')
      component = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0]))
      if (component) {
        // If local component,
        // set a component property
        if (!ve.attrs) {
          ve.attrs = {}
        }
        ve.attrs.component = component
      } else {
        // If global component,
        // don't change the tag
        ve.tag = temp.tag
      }
    }

    // Resolve properties
    resolveProperties(temp, stack, cache, ve)

    evaluateAttrs(temp, stack, cache, ve)

    // If tag is "jito-element",
    // require a component property
    // because attach shadow error occurs
    if (temp.tag === componentElementTag) {
      component = ve.attrs && ve.attrs.component
      if (!ve.attrs) {
        ve.attrs = {}
      }
      ve.attrs.component = component
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
      if (!ve.attrs) {
        ve.attrs = {}
      }
      ve.attrs.component = component
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

export let componentElementPlugin = {
  match (
    template: CustomElementTemplate,
    stack: StateStack,
    _cache: SpecialCache
  ): boolean
  {
    if (template.type === 'custom') {
      let tagChain = template.tag.split('.')
      let element = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0]))
      return (
        typeof element === 'object' &&
        element !== null &&
        element instanceof ComponentElement
      )
    }
    return false
  },

  exec (
    template: CustomElementTemplate,
    stack: StateStack,
    cache: Cache
  ): RealTarget
  {
    let temp = template as CustomElementTemplate
    let tagChain = temp.tag.split('.')
    let el = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0])) as Element | DocumentFragment | ShadowRoot | EventTarget
    let re = { el } as RealTarget

    // Resolve properties
    resolveProperties(temp, stack, cache, re)

    evaluateAttrs(temp, stack, cache, re)

    if (el instanceof Element && temp.attrs) {
      if ('@override' in temp.attrs) {
        re.override = true
      }
    }
    if (temp.children && temp.children.length) {
      re.children = evaluateChildren(temp, stack, cache)
    } else {
      re.invalid = {
        children: true
      }
    }
    return re
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
    } as RealTarget
    evaluateAttrs(template, stack, cache, re)
    return re
  }
} as EvaluatePlugin


    // Resolve properties
function resolveProperties(
  template: CustomElementTemplate | ComponentTemplate,
  stack: StateStack,
  cache: Cache,
  ve: VirtualElement | RealTarget
)
{
  let values = [] as Array<Template | string>
  let contents = [] as Array<[string, Template]>
  let children = (template.children || [])
    .map(child => {
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
    .reduce((ary, values) => { // flatMap
      ary.push(...values)
      return ary
    }, [])
  if (values.length) {
    contents.push(['content', { type: 'group', children: values } as GroupTemplate])
  }
  if (contents.length) {
    if (!ve.attrs) {
      ve.attrs = {}
    }
    contents.forEach(([name, value]) => {
      (ve.attrs as Record<string, unknown | Template>)[name] = { type: 'evaluation', value, stack } as EvaluationTemplate
    })
  }
  if (children.length) {
    ve.children = children
  }
}