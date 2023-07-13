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

**NOTE:** Prior to version 1.3.1, it was `{{ expression }}`. For compatibility, you can still use `{{ expression }}` in version 1.3.1 and later.

# Tag `<word />`

The word specified in the tag name is interpreted and drawn as an element. What is expanded differs depending on the word. If there are duplicate tag names, the one with the highest priority is used.

| Priority | Word | What it replaces |
| --- | --- | --- |
| 5 | HTML Tag name | HTML Element |
| 4 | group | Grouping Tag |
| 4 | let | Declaration Tag |
| 3 | window | Global `window` object |
| 2 | host | Host element of the current component |
| 2 | root | Shadow root of the current component |
| 1 | Variable name containing the component | `<jito-element>` element |
| 1 | Variable name containing the HTML element  | HTML element |

## Grouping Tag `<group></group>`

The `<group>` tag allows you to wrap content in a tag that is not actually drawn. It is mainly used with `@if` and `@for`.

```html
<group @if="isActive">
  <div></div>
  <div></div>
</group>
<p @else></p>
<!--
  Result(When Truthy):
  <div></div>
  <div></div>

  Result(When Falsy):
  <p></p>
-->

<group @for="[1, 2, 3]">|{| loop.value |}</group>|
<!--
  Result:
  |1|2|3|
-->
```

## Declaration Tag `<let>`

**NOTE:** Supports version 1.3.1 or later.

Groups content after the declaration tag. Mainly used with `@if` and `@bind`.

```html
<p>
  <let @if="isVisible">
  Hello Jito
</p>
```

The above is equivalent to the following (except for the spaces, to be exact)

```html
<p>
  <group @if="isVisible">
    Hello Jito
  </group>
</p>
```

# Attributes

Tag attributes can use HTML-extended syntax.

## String assignment operator `attr="string"`

When you use `=` to write an attribute, the attribute value is given to the attribute as a string, like in HTML.

## Assignment operator `attr:="expression"`

When you write an attribute using `:=`, the attribute value is evaluated as an expression and the result is given to the attribute.

```html
<img src:="domain + filename">
```

If you write a string assignment operator with the same name, the result of the assignment operator is adopted.

## Boolean assignment operator `attr&="expression"`

Writing an attribute using `&=` evaluates the attribute value as an expression, setting the result to the attribute if the result is Truthy or removing the attribute if the result is Falsy. This is mainly used for Boolean attributes.

```html
<input type="checkbox" checked&="isChecked">
```

If an attribute with the same name is defined with another operator, the other attributes will be disabled.

## Referential assignment operator `attr*="expression"`

**NOTE:** This feature is a beta version. It is not guaranteed to work properly.

When you write an attribute using `*=`, the attribute value is not evaluated as an expression, but is passed as a property that is evaluated by reference. In the example below, if you assign a value to the name property in a child component, value will be updated to the same value.

```html
<child name*="value"></child>
```

## Conditional Branch @if="expression"

Evaluates the attribute value of the `@if` attribute as an expression, and if Truthy, displays the tag with the `@if` attribute; if Falsy, nothing is displayed, but if the next tag has the `@else` attribute, it displays that tag.

```html
<div @if="isActive"></div>

<div @if="isActive"></div>
<div @else></div>

<div @if="gender === 'woman'"></div>
<div @else @if="gender === 'man'"></div>
<div @else></div>
```

## Iterate @for="expression"

Evaluates the attribute value of the `@for` attribute as an expression and repeatedly draws the tag if the result is iterable or enumerable.

When iteratively drawing, respectively, [Loop object](https://github.com/ittedev/jito/blob/main/template_engine/loop.ts) is loaded on the state stack as a variable `loop`.
You can also use `@each` to name each value.

```html
<div @for="{ x: 1, y: 2 }">{| loop.key |}:{| loop.value |}</div>

<div @for="[1, 2, 3]" @each="value">{| value |}</div>
```

## Binding @bind="name" @to="expression"

**NOTE:** Supports version 1.3.1 or later.

The attribute value of the `@to` attribute can be evaluated as an expression and named with the @bind attribute. The attached variables are stacked on the state stack and can be used when drawing the contents of the tag.

```html
<div @bind="name" @to="name + 'さん'">
  {| name |}
</div>
```

It is useful in conjunction with the `<let>` declaration tag.

```html
<let @bind="item" @to="getItem(name)">
<let @bind="name" @to="item.name">
{| name |}
```

## Chunk @chunk="expression"

**NOTE:** Supports version 1.3.1 or later.

Evaluates the attribute value of the `@chunk` attribute as an expression and passes the properties of the resulting object as attributes to the element.

```html
<img @chunk="{ src: 'item.jpg', alt: 'Item Picture' }">
```

Any number of chunks can be written in a single tag. If property names overlap, the values of chunks written later will be overwritten.

## Other Attributes

There are several other attributes, the usage of which will be described separately.

### `class`, `part`, `style`

See [CSS Styling](./Styling.md).

### Event Handler `on...="expression"`

See [Event Handling](./Event_handling.md).

### Element Override `@override`

See [Shadow DOM and Virtual Dom](./Shadow_dom.md).

### Passing template `@as="word"`

See [Component Communications](./Communications.md).

# Next

4. [Template Syntax](./Template.md)