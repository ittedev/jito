# Form binding

Unidirectional data binding of form components is possible by making full use of assignment operators and event handlers.

## Button

The button can be implemented as follows

```js
import { watch, compact } from './jito.js'

let click = () => console.log('Hello!')

let component = compact(`
  <button type="button" onclick="click()">Click me</button>
`, [click])
```

## Text box

The text box can be implemented as follows

```js
import { watch, compact } from './jito.js'

let state = watch({ value: '' })

let component = compact(`
  <input type="text" value:="value" oninput="value = event.target.value">
`, [state])
```

## Text area

The text area can be implemented as follows

```js
import { watch, compact } from './jito.js'

let state = watch({ value: '' })

let component = compact(`
  <textarea oninput="value = event.target.value">{| value |}</textarea>
`, [state])
```

## Select box

The select box can switch the `selected` attribute using the Boolean assignment operator.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: 'Dog' })

let component = compact('custom-font', `
    <select onchange="value = event.target.value">
      <option value="Cat" selected&="value === 'Cat'">Cat</option>
      <option value="Dog" selected&="value === 'Dog'">Dog</option>
      <option value="Rat" selected&="value === 'Rat'">Rat</option>
    </select>
`, [state])
```

`@for` can also be used.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: 'Dog' })
let animals = ['Cat', 'Dog', 'Rat']

let component = compact(`
  <select onchange="value = event.target.value">
    <option
      @for="animals"
      value:="loop.value"
      selected&="value === loop.value"
    >{| loop.value |}</option>
  </select>
`, [state, { animals }])
```

Binding to non-strings is possible by setting the value value to index.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: null })
let animals = [
  { name: 'Cat' }, { name: 'Dog' }, { name: 'Rat' }
]

let component = compact(`
  <select onchange="value = animals[Number(event.target.value)]">
    <option></option>
    <option
      @for="animals"
      value:="loop.index"
      selected&="value === loop.value"
    >{| loop.value.name |}</option>
  </select>
`, [state, { animals }])
```

## Radio button

Radio buttons can toggle the `checked` attribute using the Boolean assignment operator.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: '' })
let animals = ['Cat', 'Dog', 'Rat']

let component = compact(`
  <label @for="animals">
    <input type="radio"
      value:="loop.index"
      onchange="value = animals[Number(event.target.value)]"
      checked&="value === loop.value"
    />{| loop.value |}
  </label>
`, [state, { animals }])
```

Binding to non-strings is possible by setting the value value to index.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: null })
let animals = [
  { name: 'Cat' }, { name: 'Dog' }, { name: 'Rat' }
]

let component = compact(`
  <label @for="animals" @each="animal">
    <input type="radio"
      value:="loop.index"
      onchange="value = animals[Number(event.target.value)]"
      checked&="value === animal"
    />{| animal.name |}
  </label>
`, [state, { animals }])
```

## Checkbox

The checkbox can switch the `checked` attribute using the Boolean assignment operator.

```js
import { watch, compact } from './jito.js'

let state = watch({ value: false })

let component = compact(`
  <label>
    <input
      type="checkbox"
      onchange="value = event.target.checked"
      checked&="value"
    >{| value |}
  </label>
`, [state])
```

Multiple checkboxes can be complicated.

```js
import { watch, compact } from './jito.js'

let state = watch({ values: ['Rat'] })
let animals = ['Cat', 'Dog', 'Rat']

let changed = event => {
  let value = animals[Number(event.target.value)]
  if (event.target.checked) {
    if (!state.values.includes(value)) {
      state.values.push(value)
      state.values.sort((a, b) => animals.indexOf(a) - animals.indexOf(b))
    }
  } else {
    if (state.values.includes(value)) {
      state.values.splice(state.values.indexOf(value), 1)
    }
  }
}

let component = compact(`
  <label @for="animals">
    <input
      type="checkbox"
      value:="loop.index"
      onchange="changed(event)"
      checked&="values.includes(loop.value)"
    />{| loop.value |}
  </label>
`, [state, { animals, changed }])
```

![](https://cdn.jitoin.com/images/jito-docs/0c152aecb252-20220110.gif)


## Variable forms

If data-bound, form components can be switched, increased, or deleted.

```js
import { watch, compact } from './jito.js'

let state = watch({
  isActive: false,
  email: ''
})

let component = compact(`
  <p>
    <label>
      <input
        type="checkbox"
	onchange="isActive = event.target.checked"
	checked&="isActive"
      > Subscribe
    </label>
  </p>
  <p @if="isActive">
    <input
      type="email"
      value:="email"
      oninput="email = event.target.value"
      placeholder="e.g. email@example.com"
    >
    <button onclick="alert(email)">Send</button>
  </p>
`, [state])
```

![](https://cdn.jitoin.com/images/jito-docs/74d4cb0c2d6a-20220110.gif)

```js
import { watch, compact } from './jito.js'

let state = watch({
  texts: ['']
})

let component = compact(`
  <p @for="texts">
    <input
      type="text"
      value:="loop.value"
      oninput="texts[loop.index] = event.target.value"
    >
    <button onclick="texts.splice(loop.index, 1))">Remove</button>
  </p>
  <p>
    <button onclick="texts.push('')">Add</button>
  </p>
`, [state])
```

![](https://cdn.jitoin.com/images/jito-docs/a2938c33709a-20220110.gif)

# Next

8. [Component Communications](./Communications.md)