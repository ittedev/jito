# Beako.js

Beako.js is web component tools with Data Binding, Template Engine and Virtual DOM.

She support Deno and Web browsers.


## What is Beako.js?

Please wait for it to be released in the near future.

The explanation in Japanese is written [here](https://zenn.dev/itte/articles/54dfdf99622e40).

## Usage

Beako.js use ES Modules

### Deno

```shell
deno install -fA https://deno.land/x/beako_cli@0.1.0/beako.ts
```

```ts
import { watch, mount } from 'https://deno.land/x/beako@0.10.1/mod.ts'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

mount(document, `Counter: {{ count }}`, data)
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

### CDN

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module">
  import { watch, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/beako@0.10.1/beako.js'

  const data = {
    count: 1
  }

  setInterval(() => { data.count++ }, 1000)

  watch(data)

  mount(document, `Counter: {{ count }}`, data)
</script>
```

