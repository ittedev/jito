# Template Syntax

Jito templates can be written using a syntax similar to HTML.
There is a special syntax for changing the display and behavior depending on the state stack.

## Differences from HTML

- You cannot omit the closing tag of `<p></p>` or `<li></li>`.
- If a tag has no child nodes, you can use shorthand notation like `<p />`.
- The same attribute can be described more than once. The behavior of multiple attributes depends on the attribute and the way it is described.

## Expressions

Expressions are used in various situations in the template; you can use a syntax tailored to JavaScript.
Not all JavaScript syntaxes are available in Jito. Implementations will be considered according to demand.

## Variables

The properties of each object in the state stack are available as variables in the template.

There are several available build-in variables.

[Build-in variables](https://github.com/ittedev/jito/blob/main/web_components/builtin.ts)

# Display expression `{| expression |}`

**NOTE:** Prior to version 1.3.1, it was `{{ expression }}`. For compatibility, you can still use `{{ expression }}` in version 1.3.1 and later.

```html
{| 10 / 2 + 'px' |}
```

Evaluates the expression enclosed in `{|` and `|}` and replaces it with the result. What is displayed depends on the type of the result.


| Type | Output |
| --- | --- |
| boolean | value |
| number | value |
| string | value |
| undefined | not displayed |
| object | not displayed |
| Template | DOM Tree |

# Tag `<word />`

The word specified in the tag name is interpreted and drawn as an element. What is expanded differs depending on the word. If there are duplicate tag names, the one with the highest priority is used.

| Priority | Word | What it replaces |
| --- | --- | --- |
| 5 | [HTML Tag name](https://developer.mozilla.org/ja/docs/Web/HTML/Element) | HTML Element |
| 4 | group | Grouping Tag |
| 4 | let | Declaration Tag |
| 3 | window | Global `window` object |
| 2 | host | Host element of the current component |
| 2 | root | Shadow root of the current component |
| 1 | Variable name containing the component | `<jito-element>` element |
| 1 | Variable name containing the HTML element  | HTML element |