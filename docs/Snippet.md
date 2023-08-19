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


