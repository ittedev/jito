# CSS Styling

## CSS styling for Shadow DOM

Because Jito uses the Shadow DOM, elements within a component cannot be specified with selectors from the real DOM or the parent component's CSS.
To style an element within a component, you must style it within that component.
Conversely, you can style elements as you wish, with little influence from the global.

Inheritance and CSS variables such as `color` and `font-size` are inherited from the parent component.

## CSS Styling with Templates

By writing HTML in a template, you can apply styles to its components.

### Loading CSS files

You can apply CSS files to components by using `<link>` tags.

```js
import { compact } from './jito.js'

let component = compact(`
  <link rel="stylesheet" href="./base.css" />
  <span class="red">Jito</span>
`)
```

### Using the `<style>` tag

You can write `<style>` tags in your templates.

```js
import { compact } from './jito.js'

let component = compact(`
  <style>
    .red { color: red; }
  </style>
  <span class="red">Jito</span>
`)
```

Use the `:host` selector to style the host element.

```js
import { compact } from './jito.js'

let component = compact(`
  <style>
    :host {
      display: block;
      color: red;
    }
  </style>
  Hello Jito!
`)
```

Data binding is also possible.

```js
import { watch, compact } from './jito.js'

let state = watch({
  color: 'red'
})

let component = compact(`
  <style>
    .red { color: {| color |}; }
  </style>
  <span class="red">Jito</span>
`, [state])
```

### `style` attribute

The `style` attribute can contain inline styles. You can use expressions by using the assignment operator. The result of the expression must be a string.
If multiple `style` attributes are listed, they are concatenated by `;` in the order they are listed to form a single inline style.

```js
import { compact } from './jito.js'

let component = compact(`
  <span
    style="font-size: bold"
    style:="'color: ' + color"
  >Jito</span>
`, [{ color: 'red' }])
// => style="font-size: bold;color: red"
```

### `class` attribute

The `class` attribute can be written as an expression by using the assignment operator, in addition to the HTML style of listing the classes with a space between them. It works differently depending on the type of the result of the expression.

#### Specifying a class from a string

When the result of an expression of the assignment operator is a string, each string separated by a space is a class.

```js
import { compact } from './jito.js'

let component = compact(
  `<span class:="myClass">Jito</span>`,
  [{
    myClass: 'btn btn-sm'
  }]
)
```

#### Specifying a Class from an Array

When the result of an assignment operator expression is an array of strings, each element is a class.


```js
import { compact } from './jito.js'

let component = compact(
  `<span class:="myClass">Jito</span>`,
  [{
    myClass: ['btn', 'btn-sm']
  }]
)
```

#### Class designation from object

When the result of an assignment operator expression is an object, the class is the property name whose property value is Trusy.

```js
import { compact } from './jito.js'

let component = compact(
  `<span class:="myClass">Jito</span>`,
  [{
    myClass: {
      btn: true,
      'btn-sm': true,
      'btn-md': false,
    }
  }]
)
```

### `part` attribute

The `::part` pseudo-element and the `part` attribute can be used to change the style of a component from outside the Shadow DOM.
Like the `class` attribute, you can use strings, arrays, and objects.

## Apply attribute values received from a parent component

By applying the values received as attributes from the parent component to the CSS, you can change the color of each component, for example, as follows.

```js
import { define } from './jito.js'

define(
  'custom-font',
  `<span style:="'color: ' + (color || 'black')">{| content |}</span>`
)
```

```html: HTML
  <custom-font color="red">Hello</custom-font>
  <custom-font color="blue">jito</custom-font>
```