# Shadow DOM

Jito components expand the template as a Shadow DOM of the host element. Therefore, a component has all the characteristics of the Shadow DOM.

The DOM tree of the Shadow DOM is called the **Shadow tree**; the root of the Shadow tree is called the **Shadow root** or simply **root**. The difference is that the host element and the root may be outside or inside the Shadow tree.

## Access to host element and root

You can access the host element with the `host` property of the initialization function argument and the root with the `root` property.

```js
let main = ({ host, root }) => {
  ...
}
```

root is the root of the Shadow tree attached to the host element, so `host.shadowRoot` and `root` match.

**NOTE:** Note that the CSS selector `:host` in the template points to the host element, but `:root` is not the Shadow root.

## Separation from the Document tree

The Shadow tree is hidden and separated from the Document tree. This makes it difficult to access elements in the Shadow tree by traversing the `document` object; even in CSS, it is no longer possible to access them with selectors.
This allows Jito to be introduced into existing web pages with little influence from other libraries.

# Virtual DOM

The component builds a virtual DOM equivalent to the Shadow DOM, and also builds a virtual DOM from the template and updates the Shadow DOM when it finds a difference between the two virtual DOMs. This process is called **patching**.

## Not managed by the virtual DOM

You can access the Shadow DOM from the `root` property of the initialization function argument, but do not change or delete elements in the Shadow tree described in the template without going through the template, nor add elements before or after. Jito does not guarantee the behavior of any changes made.

However, even within the Shadow tree, elements whose children are not listed in the template are not subject to virtual DOM control. Therefore, you can add, change, or delete new elements at will.

```js

let component = compact(
  `<div id="id"></div>`,
  ({ root }) => {
    ...
    let p = document.createElement('p')
    root.querySelector('#id').append(p)
    ...
  }
)
```

### Plugging in HTML elements

If you pass an HTML element as a variable to the state stack, you can use it as a tag in the template. This allows you to plug HTML elements into the virtual DOM.

```js
let el = document.createElement('p')
el.appendChild(document.createTextNode('Hello'))

let component = compact(
  `<el style="color: skyblue" />`,
  [{ el }]
)
// => <p style="color: skyblue">Hello</p>
```

### `@override` attribute

**NOTE:** This feature is currently in beta.

When inserting an HTML element into the virtual DOM, it can be inserted multiple times into multiple virtual DOMs, but it will only be reflected in the Shadow DOM the first time it is inserted into a virtual DOM.
You can separate the position where the HTML element is displayed and the child nodes in the HTML element by describing tags without child nodes and tags with `@override` attribute with child nodes in two separate places.

```js
let el = document.createElement('p')

let component = compact(`
  <span style="color: skyblue"><el /></span>

  <el @override>Hello</el>
`, [{ el }])
```

The `@override` attribute can be used, for example, to rewrite the title in a separate location from the page component on a page-by-page basis.

# Next

10. [CSS Styling](./Styling.md)