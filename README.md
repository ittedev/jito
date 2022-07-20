# Beako.js

## What is Beako.js?

Beako.js is web component tools with Data Binding, Template Engine and Virtual DOM.

You can experience single page application development with just a web browser.

She support JavaScript and TypeScript for Deno.

## Examples

[Glitch Examples](https://glitch.com/@itte1)

## Usage

Beako.js use ES Modules.

### Local

```js
<script type="module">
  import { ... } from './beako.js'
  ...
</script>
```

### CDN

From jsDelivr.

```js
<script type="module">
  import { ... } from 'https://cdn.jsdelivr.net/gh/ittedev/beako@1.0.0/beako.js'
  ...
</script>
```

### TypeScript for Deno

```ts
import { ... } from 'https://deno.land/x/beako@1.0.0/mod.ts'
```

## First Example

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body></body>
<script type="module">
  import { watch, mount } from './beako.js'

  let state = watch({
    count: 1
  })

  setInterval(() => { state.count++ }, 1000)

  mount(document.body, `Counter: {{ count }}`, state)
</script>
```
