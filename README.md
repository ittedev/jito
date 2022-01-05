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
import { ... } from "https://deno.land/x/beako@v0.9.0/mod.ts";
```

### Node.js

``` shell
npm install beako
```

And,

``` ts
import { ... } from 'beako'
```

### CDN

``` html
<script type="module">
import { ... } as website from "beako.js";
</script>
```



``` ts
import { compact, watch } from 'beako/mod.ts'

const data = {
  value: 1
}

const component = compact('{{ value }}', [watch(data)])
```


``` ts
import { create } from 'beako/mod.ts'

const html = `{{ value }}`
const template = parse(html)

const component = compact(tree, {
  value: 1
})
```

