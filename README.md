# Jito

<p align="center"><img src="https://xs447853.xsrv.jp/jito.png" width="150" height="150"></p>

## What is Jito?

Jito is web component tools with Data Binding, Template Engine and Virtual DOM.

You can experience single page application development with just a web browser.

She support JavaScript and TypeScript for Deno.

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
  import { ... } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.2.1/jito.js'
  ...
</script>
```

### For Deno

```ts
import { ... } from 'https://deno.land/x/jito@1.2.1/mod.ts'
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
  import { mount } from './jito.js'

  let main = ({ watch }) => {
    let state = watch({
      count: 1
    })

    setInterval(() => { state.count++ }, 1000)

    return [state]
  }

  let html = `Counter: {{ count }}`

  mount(document.body, html, main)
</script>
```

# Functions

| API | Functions | Browser | Server |
| --- | --- | --- | --- |
| Data Binding | watch, unwatch, reach, unreach, change, lock, unlock | ✓ | ✓ |
| Virtual DOM | load, patch | ✓ |  |
| Template Engine | parse, evaluate, pickup | ✓ | ✓ |
| Web Components | compact, mount, define, elementize | ✓ |  |
