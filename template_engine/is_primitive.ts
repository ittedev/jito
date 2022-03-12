// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
// deno-lint-ignore-file no-fallthrough
export function isPrimitive(tag: string): boolean {
  switch(tag) {
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

export function notHasEnd(tag: string): boolean {
  switch (tag) {
    case 'br':
    case 'hr':
    case 'img':
    case 'input':
    case 'meta':
    case 'area':
    case 'base':
    case 'col':
    case 'embed':
    case 'keygen':
    case 'link':
    case 'param':
    case 'source':
      return true
  }
  return false
}
