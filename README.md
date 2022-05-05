# Beako.js

## What is Beako.js?

Beako.js is web component tools with Data Binding, Template Engine and Virtual DOM.

You can experience single page application development with just a web browser.

She support Web browsers and Deno.

## Examples

[Glitch Examples](https://glitch.com/@itte1)

## Usage

Beako.js use ES Modules from jsDelivr.

### CDN

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module">
  import { watch, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/beako@0.14.0/beako.js'

  const state = watch({
    count: 1
  })

  setInterval(() => { state.count++ }, 1000)

  mount(document.body, `Counter: {{ count }}`, state)
</script>
```

### Deno

```shell
deno install -fA https://deno.land/x/beako_cli@0.1.1/beako.ts
```

```ts
import { watch, mount } from 'https://deno.land/x/beako@0.14.0/mod.ts'

const state = watch({
  count: 1
})

setInterval(() => { state.count++ }, 1000)

mount(document.body, `Counter: {{ count }}`, state)
```

Build:

```shell
beako build script.ts --outdir=public
```

To Import it into html:

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module" src="script.js"></script>
```
