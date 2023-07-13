# Component Communications

Jito provides various ways to pass data between components.

## State sharing

The easiest way to share values between components is to pass the same state on the state stack.

```js
import { compact } from './jito.js'

let state = {
  name: 'brako'
}

let component1 = compact('<p>Hello {| name |}!</p>', [state])
let component2 = compact('<p>Welcome {| name |}!</p>', [state])
```

## Passing values from the parent component to child components

You can pass values from the parent component to child components.

### Attribute (Property) Passing

If you give an attribute to child components in the template of the parent component, you can refer to the given attribute in the template of the child component.

```js
import { compact } from './jito.js'

let local = compact('Hello {| name |}!')

let component = compact(
  '<local name:="name" />',
  async () => {
    let state = watch({
      name: 'jito'
    })
    { local, state }
  }
)

// => Hello jito!
```

Attributes of the Jito element can accept not only strings, but also functions and objects. Note that because the attributes are [recursive observation](./Data_binding.md), object is passed, it becomes a reactive object.

### Receiving Attributes (Properties)

**NOTE:** Supported since version 1.2.0.

If you want to get or change attributes in the initialization function, use the `take()` method.

```js
import { compact } from './jito.js'

let child = compact(
  '<p>Hello {| name |}!</p>',
  async ({ take }) => {
    let props = await take()
    return [{ name: props.name + ' san' }]
  }
)

let parent = compact(`<child name="Jito" />`, [{ child }])
```

You can use `watch()` to detect changes in received attributes and execute processing.

```js
let props = await take()
watch(props, 'name', () => {
  console.log('Changed')
})
```

#### Required Attributes and Default Values

In HTML elements, it is not mandatory to specify attributes. However, sometimes you do not want to render until you have all the attributes you need. Or sometimes you want to make sure that an attribute is referenced in the initialization function.
You can control which attributes are required and which are default values by giving options as arguments to the `take()` method.

The `take()` method will resolve the Promise when the attributes are aligned with `[attributeName]: true`. The initialization function is not complete until the attributes are aligned, so it is not rendered.

```js
import { compact } from './jito.js'

let child = compact(
  'prop1: {| prop1 |}, prop2: {| prop2 |}, prop3: {| prop3 |}',
  async ({ take }) => {
    let props = await take({
      // This attribute is required
      prop1: true,

      // This attribute is not required (the same as not writing it)
      prop2: false,

      // If this attribute is not present, the default value is 100
      prop3: { default: 100 },
    })
  }
)

let parent = compact(`<child />`, [{ child }])
// no rendering

let parent = compact(`<child prop1="Hello" />`, [{ child }])
// => prop1: Hello, prop2: , prop3: 100

let parent = compact(`<child prop1="Hello" prop2="Jito" prop3:="4649" />`, [{ child }])
// => prop1: Hello, prop2: Jito, prop3: 4649
```

**NOTE:** The `take()` method detects that it receives an attribute the first time `undefined` is no longer `undefined`. Please note that it is therefore not possible to receive `undefined`.

## Passing a value from the child component to the parent component

**NOTE:** Supported since version 1.2.0.

You can pass values from a child component to its parent component using events.
Use the `dispatch()` method to issue a custom event to the host.

```js
import { compact } from './jito.js'

let child = compact(
  `<button onclick="send('Hello')">Click me!</button>`,
  ({ dispatch }) => {
    function send(data) {
      dispatch('send', data)
    }
    return [{ send }]
  }
)

let parent = compact(`<child onsend="console.log(event.detail)" />`, [{ child }])
```

The `dispatch()` method deep-copies (structured replicates) a value and passes it to the host. Values that cannot be deep copied cannot be passed.

**NOTE:** Internally uses `structuredClone()`. Browsers that do not support `structuredClone()` use `JSON.parse(JSON.stringify())` instead.

If you want to pass values that cannot be deep-copied, such as functions, you can issue custom events directly to the host.

  ```js
let main = ({ host }) => {
  function send(data) {
    host.dispatchEvent(new CustomEvent('send', {
      detail: () => 'Hello'
    }))
  }
  return [{ send }]
}
```

## Accessing child components from a parent component

To access a child component from a parent component, you must reference the Jito element. There are two ways to do this. 1.

1. pass the component on the state stack and reference the rendered Jito element by traversing the DOM from the `root` argument of the initialization function. 2.
2. use the `elementize()` function in the initialization function to create the Jito element and then pass it to the state stack.

**NOTE:** The second method is smarter, but as of July 2022, many browsers have a delay in reflecting CSS when inserting elements with shadow DOM into the DOM. It is possible that browsers will address this issue in the future, but for now, we recommend the first method.

**Confirmed browsers**.
- FireFox

### Execute functions of child components

When a component is materialized, it adds all of its functions to the host element as methods if the variables given on the state stack contain functions. Therefore, you can execute a function of a child component by referencing the Jito element.

**How to traverse the DOM from root**.

```js
import { compact } from './jito.js'

const child = compact(``, () => {
  let myFunc = () => console.log('Hello!')
  return [{ myFunc }]
})

let parent = compact(
  `
    <root onpatch="patched()" @if="!local" />

    <child id="id" />
    <a onclick="local.myFunc()">Click me</a>
  `,
  ({ root }) => {
    let state = watch({
      local: null // Prepare a receptacle for Jito elements
    })
    let patched = () => {
      state.local = root.querySelector('#id') // Get Jito element from root
    }
    return [state, { child, patched }]
  }
)

// Outputs "Hello!" with each click
```

**How to use the `elementize()` function**

```js
import { compact, elementize } from './jito.js'

const child = compact(``, () => {
  let myFunc = () => console.log('Hello!')
  return [{ myFunc }]
})

const parent = compact(
  `
    <child />
    <a onclick="child.myFunc()">Click me</a>
  `,
  async () => {
    let local = await elementize(child)
    return [{ child: local }]
  }
)

// Outputs "Hello!" with each click
```

## Passing DOM from a parent component to a child component

It is possible to receive a portion of the DOM displayed in a child component from the parent component.
There are two ways to do this.

### Slot

Jito can use slots in Web Components as is.

For example, you can write a `<slot></slot>` tag and define an `<example-element>` in your template as follows.

```js
import { define } from './jito.js'

define('example-element', `<slot name="my-text">Hello world!</slot>`)
```

Write the following HTML anywhere you like.

```html
  <example-element></example-element>
  <example-element>
    <span slot="my-text">Hello jito!</span>
  </example-element>
```

Then the first `<example-element>` will display "Hello world!" from the `<slot>`, and the second `<example-element>` will replace the `<slot>` with a `<span>` and display "Hello jito!

### Template Passing

Templates written inside tags in the parent component's template can be received by the child component as a `content` attribute.
The received template can be expanded with `{| ... |}`. By giving the attribute, a value can also be passed.

```js
import { compact } from './jito.js'

let local = compact(`<p @for="[1, 2]">{| content |}</p>`)
let component = compact(`
  <local></local>
  <local num:="num">
    <span>{| loop.value + num |}</span>
  </local>
`, { local, num: 2 })

// => <p></p><p></p>
//    <p><span>3</span></p><p><span>4</span></p>
```

You can pass templates with arbitrary names by using the `@as` attribute when passing. You can also pass multiple elements by using it with `<group>`.

```js
import { compact } from './jito.js'

let local = compact(`
  {| header |}
`)

let component = compact(`
  <local>
    <group @as="header">
      <h2>Jito</h2>
      <p>Welcome!</p>
    </group>
  </local>
`, { local })
```

If there is more than one slot or @as attribute, the `content` attribute passed will be the one without them.

### Difference between Slot and Template Passing

The main difference between slotting and template passing is that slots are expanded in the parent component's DOM tree and passed to the child component, so they are treated as part of the parent component, whereas template passing is expanded in the child component's shadow tree, so they are The template passing is part of the child component because it is expanded in the shadow tree of the child component. Therefore, there are differences in access from the `root` property of the initialization function argument and in the CSS applied.

# Next

9. [Shadow DOM and Virtual Dom](./Shadow_dom.md)