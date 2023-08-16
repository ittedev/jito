// deno-lint-ignore-file no-explicit-any
import {
  VirtualNode,
  RealTarget,
  VirtualElement,
  VirtualTree,
  HasAttrs
} from '../virtual_dom/types.ts'
import {
  instanceOfRef,
  StateStack,
  Template,
  EvaluationTemplate,
  HasAttrTemplate,
  GroupTemplate,
  CustomTemplate,
  CustomElementTemplate,
  Cache,
  Ref,
  Snippet,
  instanceOfSnippet,
} from './types.ts'
import { pickup } from './pickup.ts'
import { isPrimitive } from './is_primitive.ts'
import { evaluate, evaluateAttrs, evaluateChildren } from './evaluate.ts'

export let realElementPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      let temp = template as CustomElementTemplate
      if (!isPrimitive(temp.tag)) {
        let tagChain = temp.tag.split('.')
        let el = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0])) as Element | DocumentFragment | ShadowRoot | EventTarget
        return temp.tag === 'window' || el instanceof EventTarget
      }
    }
    return false
  },
  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    cache: Cache
  ): RealTarget
  {
    let temp = template as CustomElementTemplate
    if (template.tag === 'window') {
      let re = {
        el: window,
        override: true,
        invalid: {
          attrs: true,
          children: true
        }
      }
      evaluateAttrs(temp, stack, cache, re)
      return re
    }
    let tagChain = temp.tag.split('.')
    let el = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0])) as Element | DocumentFragment | ShadowRoot | EventTarget
    let re = { el } as RealTarget
    evaluateAttrs(temp, stack, cache, re)
    if (el instanceof Element && temp.attrs) {
      if ('@override' in temp.attrs) {
        re.override = true
      }
    }
    if (
      (
        el instanceof Element ||
        el instanceof DocumentFragment ||
        el instanceof ShadowRoot
      ) &&
      temp.children &&
      temp.children.length
    ) {
      re.children = evaluateChildren(temp, stack, cache)
    } else {
      re.invalid = {
        children: true
      }
    }
    return re
  }
}

export let snippetPlugin = {
  match (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    _cache: Cache
  ): boolean
  {
    if (template.type === 'custom') {
      let temp = template as CustomElementTemplate
      let tagChain = temp.tag.split('.')
      let el = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0])) as Snippet

      if (instanceOfSnippet(el)) {
        return true
      }
    }
    return false
  },
  exec (
    template: CustomElementTemplate | CustomTemplate,
    stack: StateStack,
    cache: Cache
  ): VirtualNode[] | undefined
  {
    let temp = template as CustomElementTemplate
    let tagChain = temp.tag.split('.')
    let snippet = tagChain.slice(1).reduce((prop: any, key) => prop[key], pickup(stack, tagChain[0])) as Snippet
    let ve: VirtualElement = {
      tag: temp.tag
    }
    resolveProperties(temp, stack, cache, ve)
    evaluateAttrs(temp, stack, cache, ve)
    let attrs: Record<string, unknown> = {}
    if (ve.attrs) {
      for(let key in ve.attrs) {
        let value = ve.attrs[key]
        if (instanceOfRef(value)) {
          Object.defineProperties(attrs, {
            [key]: {
              get() {
                return (value as Ref).record[(value as Ref).key]
              },
              set(v) {
                (value as Ref).record[(value as Ref).key] = v
              }
            }
          })
        } else {
          attrs[key] = value
        }
      }
    }
    let keys = ['class', 'part', 'is', 'style'] as (keyof HasAttrs)[]
    keys.forEach(key => {
      if (key in ve) {
        attrs[key] = ve[key]
      }
    })
    if (ve.on) {
      for (let key in ve.on) {
        attrs['on' + key] = ve.on[key]
      }
    }
    let tree = evaluate(snippet.template, snippet.restack([...stack, { attrs }, attrs]), cache) as VirtualTree
    return tree.children
  }
}

export function resolveProperties(
  template: CustomElementTemplate,
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