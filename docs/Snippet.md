**NOTE:** Supported since version 1.4.0

**NOTE:** This feature is in beta

# Snippets

Snippets are a way to split up templates that would otherwise become bloated.
Templates are often bloated because they are converted into a single DOM tree.
In the case of components, readability is further reduced by having to describe states, events, and templates in a single file.
Therefore, snippets were introduced as a way to split up components.

## The `snip()` function

The `snip()` function creates a snippet from a template and a restack function. The restack function can be optional.

```js
import { snip } from './jito.js'

let snippet = snip(`<h1>Hello</h1>`)
```

## Using snippets

Snippets can be used as tags within a template.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`World`)

mount(document.body, `Hello <snippet />`, [{ snippet }])
```

When executed, "Hello World" will appear on the screen.

## Inheriting the state stack

A snippet inherits the state stack from its parent.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`{| name |}`)

mount(document.body, `Hello <snippet />`, [{ snippet, name: 'Jito' }])
```

When executed, "Hello Jito" will appear on the screen.

## Attribute (property) passing

Snippets can receive attributes from a parent and use them as variables.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`{| name |}`)

mount(document.body, `Hello <snippet name="Jito" />`, [{ snippet }])
```

When executed, "Hello Jito" will appear on the screen.

## Passing templates

A snippet can take children enclosed in tags from its parent as a template and use them as `content` variable.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`{| content |}`)

mount(document.body, `Hello <snippet>Jito</snippet>`, [{ snippet }])
```

When executed, "Hello Jito" will appear on the screen.

You can pass templates by name using the `@as` attribute.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`{| name |}`)

mount(
  document.body,
  `Hello <snippet><group @as="name">Jito</group></snippet>`,
  [{ snippet }]
)
```

### `attrs` variable

Attributes are grouped together as objects in the `attrs` variable.
You can use `@chunk` to give the received attributes directly to tags in a snippet.

```js
import { snip, mount } from './jito.js'

let snippet = snip(`<span @chunk="attrs">World</span>`)

mount(document.body, `Hello <snippet style="color: red" />`, [{ snippet }])
```

When executed, the "World" portion will be displayed in red on the screen.

**NOTE:** The `attrs` variable does not include the template passed by template passing.

## Re-stack function

The second argument of the `snip()` function can be a re-stack function. The restack function is a function that takes a state stack and returns a state stack. Unlike component initialization function, it cannot be an async function.

The restack function is used when you want to add a new variable to the state stack.

```js
import { mount, snip } from './jito.js'

let restack = stack => {
  let name = 'Jito'
  let output = value => alert(value)
  return [...stack, { name, output }]
}

let html = `<button type="button" onclick="output(name)">Click me</button>`

let snippet = snip(html, restack)

mount(document.body, `Hello <snippet />`, [{ snippet }])
```

Click on the button to alert "Jito".

## The `pickup()` and `assign()` functions

The `pickup()` function can be used to get a variable on the state stack in a re-stack function.
If you want to assign a variable, you can use the `assign()` function.

The `pickup()` function takes the value of the variable name specified by the second argument from the state stack passed as the first argument.

The `assign()` function assigns the value of the third argument to a variable with the name of the variable specified by the second argument on the state stack passed as the first argument.

```js
import { mount, watch, snip, pickup, assign } from './jito.js'

let restack = stack => {
  let value = pickup(stack, 'name')
  let setValue = value => assign(stack, 'name', value)
  return [...stack, { value, setValue }]
}

let html = `<input type="text" value:="value" oninput="setValue(event.target.value)" />`

let snippet = snip(html, restack)

let state = watch({
  name: 'jito'
})

mount(document.body, `Hello <snippet />`, [state, { snippet }])
```

# Differences between components and snippets

There are several differences between components and snippets.

|| Components | Snippets |
| --- | --- | --- |
| API Type | **Web Component** | **Template Engine** |
| Shadow DOM | **Build** | **Not Build** |
| State | **Have** | **Do not** |
| elementize | **can** | **can't** |
| Inherit state stack | **not inherited** | **inherited** | **assumed
| Replacement | **Assumed** | **Not Assumed** | **Assumed** | **Not Assumed** | **Not Assumed

While components are independent on their own, snippets are assumed to be used from templates.
A snippet is a part of a template that is split from the template.

## When you're not sure which to use

For many people, the similarities between components and snippets can make it difficult to decide which to use.
One indicator is to divide components and snippets into non-reusable and reusable, respectively, which can be used in four different situations.

### Non-reusable Components (NC)

A component is suitable for anything that can be uniquely identified within an app by being tied to an app, layout, or page.

### Reusable Components (RC)

Components are suitable when tied to advanced functionality that is reused in multiple places, such as input modals, image clipping, or text editors.

### Non-reusable snippets (NS)

A snippet is suitable when you want to split a bloated component file into multiple pieces.

### Reusable Snippets (RS)

A snippet is suitable when you want to describe in one place a description often used in multiple templates, such as form components, alerts, and so on.

### Example application structure

The following is an example of an application with four components and snippets.