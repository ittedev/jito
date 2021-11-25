# bearko

``` ts
import { hack, watch } from 'bearko/client.ts'

const data = {
  value: 1
}

hack('.app', '{{ value }}', { $defaults: data })
```

``` ts
import { compact, watch } from 'bearko/client.ts'

const data = {
  value: 1
}

watch(data)

const component = compact('{{ data.value }}', { data })
```

``` html
<div if="a"></div>
<div else if="a"></div>
<div else></div>

<a click!="">Click me</a>

<temp switch="">
  <div case="">
  <div case="">
  <div default>
</temp>

<div for="item of items"></div>

<header props*="{ props }"></header>

<temp with*=""></temp>

<c>
  <temp name="header">
  </temp>
</c>
```

``` ts
import { create } from 'bearko/client.ts'

const html = `{{ value }}`
const css = ``
const tree = parse(html, css)

const component = create(tree, {
  value: 1
})
```
