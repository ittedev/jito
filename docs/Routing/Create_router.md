# Create Router

**NOTE:** Supports version 1.3.1 or later.

Jito provides routing.

## Import

To use routing, import the `routing.js` file, which is a separate file from `jito.js` of Jito itself.

### Local file

```html
<script type="module">
  import { walk } from './routing.js'
  ...
</script>
```

### CDN

```html
<script type="module">
  import { walk } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/routing.js'
  ...
</script>
```

### Deno
```ts
import { walk } from 'https://deno.land/x/jito/routing/mod.ts'
...
```

### Node.js
```ts
import { walk } from 'jito/routing'
```

## The `walk()` function

You can create a router with the `walk()` function. By passing a `history` object, you can create a router tied to a browser.

```js
import { walk } from './routing.js'

export let router = walk(history)
```

If you do not pass the `history` object, you can create a router that is not tied to a browser.

## Pages and middleware

The router has several methods. The `page()` method registers a page.
The `page()` method takes a URL path pattern as its first argument and middleware as the second and subsequent arguments. Middleware is explained in `How to create middleware'.

```js
let { page } = router
page('/page1', () => console.log('page1'))
page('/page2', () => console.log('page1'))
page('*', () => console.log('Not Found'))
```

A single asterisk `'*'` in the URL pattern will create a page that matches any URL path.

We now have a router that outputs a log for each page.
There are several ways to run the router, but here we will assume that the page has just been loaded and use the `replace()` method to route from the current URL.

```js
let { replace } = router
replace(location.pathname)
```

If the URL path is "/page1", the console will output "page1".

### Parameter Routing

By using a colon `:` in the URL pattern, a part of the URL path can be parameterized.
If the URL path matches, the parameter is passed to the middleware's `params` property and finally set to the router's `params` property.

```js
let { page } = router
page('/news/:id', ({ params }) => console.log(params))
```

## Switching pages

There are several methods that can switch pages.

### `push()`

The `push()` method allows you to transition to a new page. The URL is rewritten and the browser history is added at the time of transition.

```js
let { push } = router
push('/page1')
```

### `replace()`

The `replace()` method rewrites the current URL without adding history.

```js
let { replace } = router
replace('/page1')
```

### `back()`

The `back()` method can be used to return one URL history. It reruns the routing at the corresponding URL. This is equivalent to `history.back()`.

```js
let { back } = router
back()
```

### `forward()`

The `forward()` method allows you to advance the history of a URL by one. It re-runs the routing at the corresponding URL. This is equivalent to `history.forward()`.

```js
let { forward } = router
forward()
```

### `go(n)`

Passing a positive integer to the `go()` method will advance the history by that number, passing a negative integer will bring it back by that number, and passing 0 will reload the current page. This is equivalent to `history.go()`.


### `link()`

The `link()` method is used in the template. By passing it as a chunk of the `<a>` tag, you can create an element that will execute the `push()` method when clicked.

```html
<a @chunk="link('/page1')">Click me</a>
```

### `open()`

The `open()` method performs routing without affecting the browser history. It is not usually used.
It can be used for routing that does not require history.

The `open()` method returns a Promise, which is the final context that has been traversed by each middleware, if the routing is successful.

```js
let { open } = router
open('page1')
  .then(console.log)
  .catch(console.error)
```

**NOTE:** When you want to switch pages without changing the current URL, both the `open()` and `replace()` methods can be used, but the `open()` method does not change the history, so the page cannot be returned to using the `back()` method.
Therefore, when the page is loaded for the first time, please use the `replace()` method for routing.

## `props` and `query`

When routing with the `push()`, `replace()`, `link()`, or `open()` methods, you can pass `props` as the second argument and `query` as the third argument.
The `props` and `query` are traversed across each middleware of the page whose URL path matches, and finally set to the `props` and `query` properties of the router. The `query` is then further set to the URL search query.

```js
push('/page1', { name: 'Jito' }, { id: 'jito' })
```

The `props` value can pass any serializable data, while the `query` value can only pass strings.
