// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Template, TokenField } from '../types.ts'
import { Lexer } from '../lexer/mod.ts'
import { expression } from '../parser/mod.ts'
import { JoinTemplate, FlagsTemplate, ElementTemplate } from '../template/mod.ts'

export function parseElement(el: Element): ElementTemplate {
  const template = {
    tag: el.tagName.toLowerCase(),
    class: [] as Array<Array<string> | Template<Array<string>>>,
    part: [] as Array<Array<string> | Template<Array<string>>>,
    attr: {} as Record<string, unknown | Template<unknown>>,
    style: '' as string | Template<string>,
    bind: {}
  }
  
  if (el.hasAttributes()) {
    const style = [] as Array<string | Template<unknown>>
    el.getAttributeNames().forEach(name => {
      const value = el.getAttribute(name) as string
      switch (name) {
        case 'class':
        case 'part': {
          return template[name].push(value.split(/\s+/))
        }
        case 'style': {
          return style.push(value)
        }
      }

      // addition assign attribute
      {
        const match = name.match(/^(?<name>.+)(\+.*)$/)
        if (match?.groups) {
          switch (match.groups.name) {
            case 'class':
            case 'part': {
              return template[match.groups.name].push(new FlagsTemplate(expression(new Lexer(value, TokenField.script))))
            }
            case 'style': {
              return style.push(expression(new Lexer(value, TokenField.script)))
            }
            // events
          }
        }
      }

      // assign attribute
      {
        const match = name.match(/^(?<name>.+):$/)
        if (match?.groups) {
          return template.attr[match.groups.name] = expression(new Lexer(value, TokenField.script))
        }
      }

      // bind
      {
        const match = name.match(/^(?<name>.+)\*$/)
        if (match?.groups) {
          // TODO
          // bindFormula(value, bind, match.groups.name)
        }
      }

      // string attribute
      if (!(name in template.attr)) {
        return template.attr[name] = value
      }
      return
    })
    if (style.length) {
      template.style = new JoinTemplate(style.filter(value => value !== ''), ';')
    }
  }
  return new ElementTemplate(template)
}

