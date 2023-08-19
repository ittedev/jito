# Jito

<p align="center"><img src="https://cdn.jitoin.com/images/jito-docs/jito.png" width="150" height="150"></p>

## What is Jito?

Jito is a JavaScript web component framework with Data Binding, Template Engine, Virtual DOM and routing.

You can experience single page application development with just a web browser.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/ittedev/jito)
![GitHub](https://img.shields.io/github/license/ittedev/jito)

## Document

- [日本語](https://zenn.dev/itte/books/5ce6aac9166aed)
- [English (DeepL Translation)](./docs/)

## First Example

Please save the following code as `example.html` and try opening it in your web browser. A counter that counts up every time you click.

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body></body>
<script type="module">
  import { watch, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.4.0/jito.js'

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

## Import

Jito use ES Modules.

No installation is required to use Jito.
Just browse to a single `jito.js` file from your web browser to start using Jito.

### From a local file

You can download the latest version of the `jito.js` file from [Releases](https://github.com/ittedev/jito/releases).

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
  import { ... } from 'https://cdn.jsdelivr.net/gh/ittedev/jito@1.4.0/jito.js'
  ...
</script>
```

### For Deno

Distributed for Deno on [deno.land/x](https://deno.land/x/jito).

See the following It needs to be built for browsers at [esbuild](https://esbuild.github.io/), etc.

```ts
import { ... } from 'https://deno.land/x/jito@1.4.0/mod.ts'
```

### For Node.js

It is distributed via npm for Node.js.

For Node.js, installation is required with the following command.

```sh
npm i jito
```

See the following It needs to be built for browsers at [esbuild](https://esbuild.github.io/), etc.

```ts
import { ... } from 'jito'
```


# Functions

Jito consists of APIs categorized as data binding, virtual DOM, template engine, web component, and routing. APIs are mainly provided as functions.

To use the functions, import them from their respective files as follows.

| API | File | Functions | Browser | Server |
| --- | --- | --- | --- | --- |
| Data Binding | jito.js | watch, unwatch, reach, unreach, change, lock, unlock | ✓ | ✓ |
| Virtual DOM | jito.js | load, patch | ✓ |  |
| Template Engine | jito.js | parse, evaluate, snip, pickup, assign | ✓ | ✓ |
| Web Components | jito.js | compact, mount, define, elementize | ✓ |  |
| Routing | routing.js | walk | ✓ |  |


# Next

2. [Tutorial](./docs/Tutorial.md)