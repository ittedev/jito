# Component Replacement

When a component is drawn as a child component, it can be dynamically replaced by simply assigning the new component to the state object.

```js
import { watch, compact } from 'jito.js'

let child1 = compact('child1')
let child2 = compact('child2')

let state = watch({
  child: child1
})

let parent = compact('<child />', [state])

state.child = child2 // Replacing the component
```

When a component is replaced, the initialization function of the new component runs and a destroy event is issued to the old component element.

## Insert a component from a module

If you have a file that exports default components, you can use that module as a component.

**Module side**

```js
export default compact('child2')
```

**Import side**

```js
import { watch, compact } from 'jito.js'

let child1 = compact('child1')

let state = watch({
  child: child1
})

let parent = compact('<child />', [state])

state.child = await import('child2.js') // Replacing the component
```

## Inserting component elements

You can also replace components that have been pre-instantiated with `elementize()`. By pre-elementizing, component elements can be reused without changing their state.

```js
import { watch, compact, elementize } from 'jito.js'

let child1 = await elementize(compact('child1'))

let state = watch({
  child: child1
})

let parent = compact('<child />', [state])

state.child = await elementize(import('child2.js')) // Replacing the component
```

## Routing Functionality

Jito allows you to switch views simply by swapping components, so you can use your favorite router library for routing according to your URL.
Jito provides a dedicated router, which can also be used.
