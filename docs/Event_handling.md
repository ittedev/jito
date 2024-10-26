# Event handling

Jito can process events in a manner similar to raw HTML.

## Event handler on... ="expression"

Evaluates an attribute value as an expression when an event is received.
When the attribute value is evaluated, the variable `event` is added to the state stack as an Event object for the event type.

```html
<button value="val" onclick="value = event.target.value">Click me</button>
```

**NOTE:** Since version 1.5.0, the `this` keyword can also be used.

## Tags for special event targets

To facilitate registration of event handlers, special tags are provided for some event targets.

### `<window />` tag

The `<window />` tag can be used to register event handlers for the `window` object.

```js
let component = compact(
  `
    <window onscroll="value = window.pageYOffset" />
    {| value |}
  `,
  () => {
    let state = watch({
      value: 0
    }
    return [{ state }]
  }
)
```

### `<host />` tag

The `<host />` tag can be used to register event handlers for host elements. It is mainly used for `destroy` custom events.

```js
let component = compact(
  `
    <host ondestroy="destroyed()" />
    {| value |}
  `,
  () => {
    let intervalId = setInterval(() => console.log('Hello'), 500);
    let destroyed = () => {
      clearInterval(intervalId)
    }
    return [{ destroyed }]
  }
)
```

### `<root />` tag

You can register event handlers for the root by using the `<root />` tag.
Events that occur in the Shadow DOM are propagated to the root. You can receive `patch` events and stop the propagation if you do not want the event to be propagated to the DOM to which the host element belongs.

```js
let component = compact(`
  <root onclick="event.stopPropagation()" />

  <button onclick="console.log('Hello')">Click me</button>
`)
```

## Original custom events

Jito fires its original custom events.

### `patch` event

The `patch` event is sent to the root when the virtual DOM is reflected in the DOM. The event is propagated to the parent element.

```js
let component = compact(
  '<root onpatch="patched()" />',
  () => {
    let patched = () => {
      console.log('patched!')
    }
    return [{ patched }]
  }
)

// => patched!
```

Due to the propagating behavior of `patch` events, you will also get `patch` events for local components. To narrow down to only your own components, verify that `event.composedPath()[0]` matches root.

```js
let local = compact(``)

let component = compact(
  `
    <root onpatch="patched(event)" />

    <local />
  `,
  ({ root }) => {
    let patched = event => {
      if (event.composedPath()[0] === root) {
        console.log('patched me!')
      }
    }
    return [{ local, patched }]
  }
)
```

Propagation to the parent element can also be stopped on the local component side.

```js
let local = compact(`<root onpatch="event.stopPropagation()" />`)

let component = compact(
  `
    <root onpatch="patched(event)" />

    <local />
  `,
  () => {
    let patched = event => {
      console.log('patched!')
    }
    return [{ local, patched }]
  }
)
```

### `destroy` event

The `destroy` event is fired when an HTML element managed by the virtual DOM is deleted when the virtual DOM is reflected in the DOM. This event is not propagated.

The `destroy` event is not fired on HTML elements outside the virtual DOM management (e.g., host elements of the `mount()` function or elements created with `elementize()`). To guarantee the firing of the `destroy` event, register the component as a child component.

In the following example, the `destroy` event fires after 1 second.

```js
let local = compact(
  `<host ondestroy="destroyed()" />`,
  () => {
    let destroyed = () => {
      console.log('destroyed!')
    }
    return [{ destroyed }]
  }
)

let component = compact(
  '<local @if="isActive" />',
  () => {
    let state = watch({
      isActive: true
    })
    setTimeout(() => state.isActive = false, 1000)

    return [state, { local }]
  }
)
```

### Changing the type name of a custom event

Jito uses the commonly used English words `destroy` and `patch` as event type names. These names may conflict with custom events in other libraries. You can change the names with the `eventTypes` object.

```js
import { compact, eventTypes } from './jito.js'

eventTypes.destroy = 'jito-destroy'
eventTypes.patch = 'jito-patch'

let component = compact(
  'Template here',
  ({ host }) => {
    host.addEventListener('jito-patch', event => {
      console.log('patched:', event.detail.tree)
    })
  }
)
```

# Next

6. [Data Binding](./Data_binding.md)