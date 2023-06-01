# What is a component?

Jito is a component-based library. A component is each part of a website divided into independently working functions.
A component is just an object, but it is ultimately associated with a HTML element.

# Steps to start using the component

Two steps are required to start using a component.

- Create the component
- Elementize the component

# `compact()` function

Use the `compact()` function to create a component.

- First argument: **template string**
- Second argument: **state stack** (optional)

```js
import { compact } from './jito.js'

let component = compact(`<strong>Hello</strong>`)
```

## State stack

The state stack is a one-dimensional array of objects. The properties of each object in the state stack can be used as variables in the template.

If there are multiple properties with the same name in the state stack, the objects in the state stack are looked at from the back and the first property found is adopted.
For example, in the following component, `y` would be 6.

```js
import { compact } from './jito.js'

let stack = [
  { x: 1, y: 2 },
  { y: 6 }
]

let component = compact(`<strong>{| x + y |}</strong>`, stack)
```

## Initialization function

The second argument of the `compact()` function can be a **initialization function**.

An initialization function is a function that takes arguments and returns a state stack as its return value. It can be used to initialize variables (initialization function arguments are discussed below).

```js
import { compact } from './jito.js'

let main = entity => {
  let x = 1
  let y = 2
  return [{ x, y }]
}

let component = compact(`<strong>{| x + y |}</strong>`, main)
```

**NOTE:** It is recommended to name the initialization function `main` for the following reasons.
- Because it can define functions used in the component other than initialization, and because it is a function that describes the main function of the component.
- Because it is a short and easy-to-remember English word.


### Async initialization function

Initialization functions can be async functions. To make it an async function, return `Promise` as the return value or use the `async` keyword.
In this case, the template will not be rendered until the asynchronous process is resolved.

```js
import { compact } from './jito.js'

let main = async () => {
  let obj = await fetch('http://example.com/object.json').then(res => res.json())

  return [{ obj }]
}

let component = compact(`<strong>{| obj.property |}</strong>`, main)
```

# Elementize components

A component cannot be used just by creating it; it is rendered only when it is associated with an HTML element.
To associate a component with an HTML element is called **elementize** the component, and the HTML element to which the component can be associated is called a **host element**.
See [Elements to which shadow trees can be added](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) for HTML elements that can be host elements.

## Ways to elementize a component

There are multiple ways to elementize a component.

## `mount()` function

The `mount()` function binds a component to an HTML element already existing in the DOM.

- First argument: HTML element or selector that can identify it
- Second argument: the component

```ts
import { compact, mount } from './jito.js'

let component = compact('<p>Hello {| name |}!</p>', [{ name: 'jito' }])

mount('#target', component)
```


## `define()` function

The `define()` function registers a component as a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).
The component is elementized when you write a custom element in HTML or create a custom element with `document.createElement()`.

- First argument: name of the custom element (must contain at least one hyphen `-`)
- Second argument: the component.

```ts
import { compact, define } from './jito.js'

let component = compact('<p>Hello {| name |}!</p>', [{ name: 'jito' }])

define('hello-tag', component)
```

## Jito elements

When you import Jito, a `<jito-element>` custom element is automatically defined.
The `<jito-element>` custom element has a `component` attribute that elementizes the component into itself when passed. Thus, the host element becomes the `<jito-element>` custom element.
This is a special custom element, called a **component element** or **jito element**.

The component will appear in the DOM as `<jito-element>`, and will also appear as `<jito-element>` when using the web browser's development tools.

**NOTE:** Custom elements cannot be overwritten with the same name, so if you import multiple Jitos, only the `<jito-element>` custom element of the first Jito you import will be defined, so be careful about the order when importing different versions of the `jito.js` file Please be careful about the order when importing different versions of the `jito.js` file.

### Attribute Extensions

The Jito element can accept non-string attribute values such as numbers and objects.

See [Intercomponent Communication](https://zenn.dev/itte/books/5ce6aac9166aed/viewer/290d4a) for more information on how to receive values.

## Child Components

When a component is passed as a variable on the state stack of another component, it can be elementized by writing a tag within that template. A component that is elementized in this way is called a **child component**. A component whose template includes a child component is called the child component's **parent component**.
Hyphens are not required in the names of child components.

```ts
import { compact } from './jito.js'

let child = compact('Hello!')
let parent = compact('<hello />', [{ hello: child }])
```

A child component are materialized as a Jito element. Therefore, the following two lines are identical.

```html
<hello />
<jito-element component:="hello" />
```

## The `elementize()` function

The `elementize()` function creates a new Jito element as an HTML element.

- First argument: the component
- Second argument: attributes (optional)

The `elementize()` function waits for the initialization function to be resolved and returns a Promise that returns an HTML element.

```js
import { compact, elementize } from './jito.js'

let component = compact('<p>Hello {| name |}!</p>')

let element = await elementize(component, { name: 'jito' })
```

# The argument of the initialization function

The argument of initialization functions are called an entity in the internal implementation of the Jito library. Various functions are available in the initialization function as properties of the entity.

The following example accesses the Shadow DOM from the `root` property after rendering is complete.

```js
import { compact, watch } from './jito.js'

let main = ({ root }) => {
  let state = watch({
    el: null
  })
  let patched = () => {
    state.el = root.querySelector('#id') // Access to Shadow DOM
    console.log(state.el.innerHTML)
  }
  return [state, { patched }]
}

let html = `
  <root onpatch="patched()" @if="!el" />

  <p id="id">Hello!</p>
`

let component = compact(html, main)

// => Hello!
```