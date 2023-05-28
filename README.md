# Jito

<p align="center"><img src="https://xs447853.xsrv.jp/jito.png" width="150" height="150"></p>

## What is Jito?

Jito is web component tools with Data Binding, Template Engine and Virtual DOM.

You can experience single page application development with just a web browser.

She support JavaScript and TypeScript for Deno.

## First Example

Please save the following code as `example.html` and try opening it in your web browser. A counter that counts up every time you click.

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body></body>
<script type="module">
  import { watch, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.3.3/jito.js'

  let state = watch({
    count: 0
  })

  let html = `
    Counter: {| count |}
    <button onclick="count++">Add</button>
  `

  mount(document.body, html, state)
</script>
```

## Examples

[Glitch Examples](https://glitch.com/@ittedev/jito-examples)

## Document

[Japanese](https://zenn.dev/itte/books/5ce6aac9166aed)

## Import

Jito use ES Modules.

### From a local file

```js
<script type="module">
  import { ... } from './jito.js'
  ...
</script>
```

### From CDN

From jsDelivr.

```js
<script type="module">
  import { ... } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.3.3/jito.js'
  ...
</script>
```

### For Deno

```ts
import { ... } from 'https://deno.land/x/jito@1.3.3/mod.ts'
```

### For Node.js

Install:

```sh
npm i jito
```

Import:

```ts
import { ... } from 'jito'
```


# Functions

| API | Functions | Browser | Server |
| --- | --- | --- | --- |
| Data Binding | watch, unwatch, reach, unreach, change, lock, unlock | ✓ | ✓ |
| Virtual DOM | load, patch | ✓ |  |
| Template Engine | parse, evaluate, pickup | ✓ | ✓ |
| Web Components | compact, mount, define, elementize | ✓ |  |
| Router | walk | ✓ |  |
