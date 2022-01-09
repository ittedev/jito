// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
// deno-lint-ignore-file no-fallthrough
import { VirtualElement } from '../virtual_dom/types.ts'
import {
  Variables,
  Evaluate,
  Template,
  instanceOfTemplate,
  TreeTemplate,
  ElementTemplate,
  HasAttrTemplate,
  IfTemplate,
  ForTemplate,
  GroupTemplate
} from '../template_engine/types.ts'
import { evaluate, evaluator, evaluateProps } from '../template_engine/evaluate.ts'
import { EvaluationTemplate, CustomElementTemplate, instanceOfComponent } from './types.ts'
import { ComponentElement, localComponentElementTag } from './element.ts'

evaluator.evaluation = (
  (template: EvaluationTemplate, stack: Variables): unknown =>
    evaluate(
      template.template,
      template.stack ? template.stack.concat(stack) : stack
    )
) as Evaluate

evaluator.custom = (
  (template: CustomElementTemplate, stack: Variables): VirtualElement => {
    const el = { tag: template.tag } as VirtualElement

    if (template.is) {
      el.is = typeof template.is === 'string' ? template.is : evaluate(template.is, stack) as string
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
              // delete temp.props['@as']
              return []
            } else if(temp.props.slot) {
              return [evaluate(child, stack) as string | VirtualElement | number]
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

      evaluateProps(template as ElementTemplate, stack, el)
      
      return el
  } else {
    return evaluator.element(template as ElementTemplate, stack) as VirtualElement
  }
}) as Evaluate



export function extend(template: unknown | Template): unknown | Template {
  if (instanceOfTemplate(template)) {
    switch (template.type) {
      case 'element':
        if (!isPrimitive(template as ElementTemplate) || 'is' in (template as ElementTemplate)) {
          template.type = 'custom'
        }
      case 'tree':
        (template as TreeTemplate).children?.forEach(extend)
        break
      case 'if': {
        extend((template as IfTemplate).truthy)
        extend((template as IfTemplate).falsy)
        break
      }
      case 'for': {
        extend((template as ForTemplate).value)
        break
      }
    }
  }
  return template
}


function isPrimitive(template: ElementTemplate): boolean {
  switch(template.tag) {
    // Main root
    case 'html':
    // Document metadata
    case 'base': case 'head': case 'link': case 'meta': case 'style': case 'title':
    // Sectioning root
    case 'body':
    // Content sectioning
    case 'address': case 'article': case 'aside': case 'footer': case 'header':
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
    case 'main': case 'nav': case 'section':
    // Text content
    case 'blockquote': case 'dd': case 'div': case 'dl': case 'dt':
    case 'figcaption': case 'figure':
    case 'hr': case 'li': case 'ol': case 'p': case 'pre': case 'ul':
    // Inline text semantics
    case 'a': case 'abbr': case 'b': case 'bdi': case 'bdo': case 'br': case 'cite':
    case 'code': case 'data': case 'dfn': case 'em': case 'i': case 'kbd': case 'mark': case 'q':
    case 'rp': case 'rt': case 'ruby': case 's': case 'samp': case 'small': case 'span':
    case 'strong': case 'sub': case 'sup': case 'time': case 'u': case 'var': case 'wbr':
    // Image and multimedia
    case 'area': case 'audio': case 'img': case 'map': case 'track': case 'video':
    // Embedded content
    case 'embed': case 'iframe': case 'object': case 'param':
    case 'picture': case 'portal': case 'source':
    // SVG and MathML
    case 'svg': case 'math':
    // Scripting
    case 'canvas': case 'noscript': case 'script':
    // Demarcating edits
    case 'del': case 'ins':
    // Table content
    case 'caption': case 'col': case 'colgroup': case 'table': case 'tbody':
    case 'td': case 'tfoot': case 'th': case 'thead': case 'tr':
    // Forms
    case 'button': case 'datalist': case 'fieldset': case 'form':
    case 'input': case 'label': case 'legend': case 'meter':
    case 'optgroup': case 'option': case 'output':
    case 'progress': case 'select': case 'textarea':
    // Interactive elements
    case 'details': case 'dialog': case 'menu': case 'summary':
    // Web Components
    case 'slot': case 'template':
      return true
  }
  return false
}

