# Beako.js

Beako is web component tools with Data Binding, Template Engine and Virtual Dom.

She support Deno and Web browsers.


## What is Beako.js?

Please wait for it to be released in the near future.

## Usage

Beako.js use ES Modules

### Deno

```ts
import { hack } from 'https://deno.land/x/beako@v0.9.11/mod.ts'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

hack(document, `Counter: {{ count }}`, data)
```

To bundle script.js with a configuration file:

```shell
deno bundle --config deno.json script.ts > script.bundle.js
```

To Import it into html:

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module" src="script.bundle.js"></script>
```

### CDN

```html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module">
  import { watch, hack } from 'https://unpkg.com/beako@0.9.11/beako.js'

  const data = {
    count: 1
  }

  setInterval(() => { data.count++ }, 1000)

  watch(data)

  hack(document, `Counter: {{ count }}`, data)
</script>
```

