# Jito

<p align="center"><img src="https://xs447853.xsrv.jp/jito.png" width="150" height="150"></p>

## What is Jito?

Jito is web component tools with Data Binding, Template Engine and Virtual DOM.

You can experience single page application development with just a web browser.

She support JavaScript and TypeScript for Deno.

## Examples

[Glitch Examples](https://glitch.com/@itte1)

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
  import { ... } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.0.0/jito.js'
  ...
</script>
```

### For Deno

```ts
import { ... } from 'https://deno.land/x/jito@1.0.0/mod.ts'
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


## First Example

Please save the following code as `example.html` and try opening it in your web browser. A counter that counts up every second is displayed.

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body></body>
<script type="module">
  import { watch, mount } from './jito.js'

  let state = watch({
    count: 1
  })

  setInterval(() => { state.count++ }, 1000)

  mount(document.body, `Counter: {{ count }}`, [state])
</script>
```
