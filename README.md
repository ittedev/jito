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
deno install -f --allow-read --allow-write --allow-env --allow-run https://deno.land/x/beako@v0.9.18/cli/beako.ts
```

```ts
import { watch, hack } from 'https://deno.land/x/beako@v0.9.19/mod.ts'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

hack(document, `Counter: {{ count }}`, data)
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
  import { watch, hack } from 'https://unpkg.com/beako@0.9.19/beako.js'

  const data = {
    count: 1
  }

  setInterval(() => { data.count++ }, 1000)

  watch(data)

  hack(document, `Counter: {{ count }}`, data)
</script>
```

