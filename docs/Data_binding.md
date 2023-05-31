# Data Binding

Jito provides several functions for data binding to components. These are not a set of functions intended for pure reactive programming. They are characterized by recursive observation.

**NOTE:** Jito does not use a Proxy, but observes objects by overriding their properties. Please be careful about compatibility with other libraries as it boldly destroys objects.

## `watch()`

The `watch()` performs **recursive observation** (see below) of the object given as the first argument. It provides two types of reactions depending on how the arguments are given.
It also returns the variable given as the first argument as-is as the return value.

### Two `watch()`s

Before explaining its usage, it is important to note that there are two types of `watch()`: global `watch()` and local `watch()`. Both have exactly the same interface but different scopes.

### Global `watch()` function

- Global `watch()` function
- Import from `jito.js`.
- Can be used anywhere.
- Terminate observing with the `unwatch()` function.

```js
import { watch } from './jito.js'
...
```

### `watch()` method

**NOTE:** Supported since version 1.2.0.

- Local `watch()` method.
- Referenced from the argument of the initialization function.
- Can only be used within a component.
- When the component is destroyed, observe also terminates.

```js
compact(``, ({ watch }) => {
  ...
})
```

### Recursive Reactive

By specifying the object to be observed as the first argument of `watch()` and the callback function as the second argument, the existing properties of the object are observed recursively and the callback function is called when a change occurs.

```js
import { watch } from './jito.js'

let state = {
  user: {
    name: 'world'
  }
}

watch(state, () => console.log('Updated!'))

state.user.name = 'jito' // => "Updated!" is output here
```

If the second argument is omitted, the object can be an object that only observes recursive observation and does not invoke callback functions.

#### First run

**NOTE:** Supported since version 1.2.0.

Passing `true` as the third argument will execute the callback function as well as observe recursive observation.

```js
import { watch } from './jito.js'

let state = {
  name: 'Jito'
}

watch(state, () => console.log('Updated!'), true) // => "Updated!" is output here
```

### Property-specified reactive

By specifying the object to be observed as the first argument of `watch()`, the property name as the second argument, and the callback function as the third argument, the callback function can be executed only when the specified property is changed.
The callback function receives the value after the change as its first argument and the value before the change as its second argument.

```js
import { watch } from './jito.js'

let state = {
  name: 'world',
  count: 0
}

watch(state, 'name', (to, from) => console.log(`Updated! ${from} => ${to}`))

state.name = 'jito' // => "Updated! world => "jito" is output
state.count++ // => Nothing is output
```

## Recursive observation

Recursive observation with the `watch` function recursively traverses all properties of the target object (or each element in the case of an array), monitors them all, and executes all recursive reactive callback functions when changes are made.

### Reactive Objects

The object being observed is called a **Reactive Object** or **Jito Object** and has the `Jito Object` symbol; Jito observes the object by overriding its properties, so a Reactive Object is identical to the original object.

### Objects that can be reactive objects

Instances of `null` and classes cannot be reactive objects, and recursive observation will not be performed below them. More precisely, only data that satisfy the following conditions can be made reactive objects

```js
typeof data === 'object' &&
data !== null &&
(Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))
```

### Changing Values

When an object is assigned to a property of a reactive object, the new object is added to the recursive observation as soon as the callback function is executed. The original object remains a reactive object, but the recursive reactivity inherited from the parent object is removed.

```js
import { watch } from './jito.js'

let world = { name: 'world', count: 0 }
let jito = { name: 'jito', count: 0 }

let state = {
  user: world
}

watch(state, () => console.log('Updated!'))

world.count++ // => "Updated!" is output
jito.count++ // => Nothing is output

state.user = jito // => "Updated!" is output

world.count++ // => Nothing is output
jito.count++ // => "Updated!" is output
```

### reactive monitoring

Reactive objects observe property changes, but cannot detect newly added properties. In that case, you can observe the added properties by doing `watch()` again.

```js
import { watch } from './jito.js'

let state = {
  name: 'Jito',
}

watch(state, () => console.log('Updated!'))

state.count = 1 // => Nothing is output
state.count++ // => Nothing is output
watch(state)
state.count++ // => "Updated!" is output
```

## Component Data Binding

Upon detecting an update to a reactive object given on the state stack, the component patches and the change is immediately reflected in the Shadow tree.

```ts
import { watch, compact } from './jito.js'

let state = watch({
  name: 'world'
})

setTimeout(() => { state.name = 'jito' }, 2000)

let component = compact('<p>Hello {{ name }}!</p>', state)
// "Hello world!" changes to "Hello jito!" after 2 seconds.
```
### Component Attributes

Components observe recursive observation of all attributes except `is`, `class`, `part`, and `style`. Note that if an attribute is given an object, it becomes a reactive object.

**NOTE:** The `is`, `class`, `part`, and `style` are managed by the template engine.
