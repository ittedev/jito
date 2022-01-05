# Beako.js

Beako is web component tools with Data Binding, Template Engine and Virtual Dom.

She support Deno, Web browsers and Node.js


## What is Beako.js?

Please wait for it to be released in the near future.

``` ts
const data = {
  value: 1
}

watch(data)

hack('#app', '<span>{{ value }}</span>', data)
```

## Usage

Beako.js use ES Modules

### Deno

``` ts
import { hack } from 'https://deno.land/x/beako@v0.9.3/mod.ts'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

hack(document, `Counter: <span>{{ count }}</span>`, data)
```

To bundle script.js with a configuration file:

``` shell
deno bundle --config deno.json script.ts > script.bundle.js
```

To Import it into html:

``` html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module" src="script.bundle.js"></script>
```

### CDN

``` html
<!DOCTYPE html>
<meta charset="UTF-8">
<body>Loading...</body>
<script type="module" src="script.bundle.js"></script>
import { hack } from 'https://unpkg.com/beako@0.9.3/beako.js'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

hack(document, `Counter: <span>{{ count }}</span>`, data)
</script>
```

### Node.js

``` shell
npm install beako
```

And,

``` js
import { hack } from 'beako'

const data = {
  count: 1
}

setInterval(() => { data.count++ }, 1000)

watch(data)

hack(document, `Counter: <span>{{ count }}</span>`, data)
```

