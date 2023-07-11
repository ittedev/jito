# Embed the component as a page

To treat a component as a page, use the `<panel>` tag and the `embed()` method.

## `<panel>` tag

First, observe the router with the `watch()` function and pass it as a component state stack.
Put a `<panel>` tag at the location where you want the component to appear. This displays the `panel` property of the router as a tag. the default value of the `panel` property is `null`, but the routing will replace this `panel` property with the component.

```js
import { mount, watch } from './jito.js'
import { walk } from './routing.js'

export let router = watch(walk(history))

mount(document.body, `<panel />`, [router])
```

### Receiving parameters

To receive URL pattern parameters in the component, pass the `params` property as a chunk to the `<panel>` tag. 

```html
<panel @chunk="params">
```

On the component side, the `take()` method accepts parameters.

```js
import { compact } from './jito.js'

let main = async ({ take }) => {
  let props = await take({
    id: true
  })
  let post = await fetch(`/api/news/${id}`).then(res => res.json())
  return [post]
}

let html = `{| post.body |}`

export compact(html, main)
```

If you want to receive `props` or `query` in the component as well, pass them as chunks in the `<panel>` tag in the same way.

```html
<panel @chunk="params" @chunk="query" @chunk="props">
```

If there are duplicate property names in `params`, `props`, or `query`, the one written later will be passed to the component according to the chunk specification.

## `embed()` method

Passing the component to the router's `embed()` method generates middleware that replaces the `panel` property with the component.
This is used to link pages and components as follows.

```js
let { page, embed } = router
page('/page1', embed('/page1.js'))
page('/page2', embed('/page2.js'))
```

Here, 'page1.js' and 'page2.js' are module files that export default components.

## Various ways to embed components

When the `embed()` method receives a string, it treats it as the file path of the component module and sets the panel with the component export defaulted with the matching file.

Not only that, you can embed components in various ways.

### Embedding from a module

Since the `embed()` method can also accept modules and module Promises, the following methods all display the same components. There is a difference in when the files are loaded in each of them.

| Passing Arguments | When to Read |
| ---- | ---- |
| `embed('/file.js')` | When the middleware is first run |
| `embed(import('/file.js'))` | Preload middleware before it is executed |
| `embed(await import('/file.js'))` | Page setup not complete until loaded |

**NOTE:** As a precaution for embedding from a module, files should be specified with absolute paths; the web browser's `import()` reads files relative to the current URL, so if a file is specified with a relative path, it will not be read if the URL directory is changed.

### Embedding Components

You can also pass a component and its Promise directly to the `embed()` method instead of a module.

```js
embed(compact('<h1>Hello World</h1>'))
```

### Embedding an element

HTML element and component element elementized with the `elementize()` function and its Promise can also be passed to the `embed()` method.

```js
embed(document.createElement('div'))
embed(elementize(compact('<h1>Hello World</h1>')))
```

### Maintaining state when switching pages

When embedding a module or component with the `embed()` method, the old component will issue a `destroy` event when the page changes, and the new component will execute its initialization function.

If you want to reuse components without destroying and creating new ones each time you switch pages, pass the `elementize()` function as the second argument to the `embed()` method.

```js
embed('/file.js', elementize)
```

If you pass the `elementize()` function to the `embed()` method, the router will elementize and store the component for each URL pattern.
Please note that the component elements are not regenerated at this time even if the `params`, `props`, or `query` passed by the middleware are different.

**NOTE:** In some Web browsers, CSS may not be immediately applied when adding component elements, causing flickering.

To suppress this to some extent, there is a way to delay the reflection of non-CSS elements when rendering the page.

The following is an example of this: a page is named, and when the name does not match (not displayed in the panel), the elements under the `<let>` are deleted, and when the name matches, they are regenerated.
The names move with a delay from the component embedding, which reduces flickering.

**app.js**
```js
import { watch, elementize } from './jito.js'
import { walk } from './routing.js'

export let router = watch(walk(history))

let name = (pageName) => {
  return async ({ props, next }) => {
    await new Promise(r => setTimeout(r, 100))
    return next({ ...props, pageName })
  }
}

let { page, embed } = router

page('/page1', embed('/page1.js'), name('page1'))
page('/page2', embed('/page2.js'), name('page2'))

replace(location.pathname)
```

**page1.js**
```js
import { router } from './app.js'
import { compact } from './jito.js'

let main = () => {
  return [router]
}

let html = `
<link rel="stylesheet" href="/style.css">

<let @if="pageName === 'page1'">

<button class="btn">Click me!<button>
`

export default compact(html, main)
```

Hopefully all web browsers will support correct rendering without using such a method.
