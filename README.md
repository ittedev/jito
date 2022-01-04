# Beako

Beako is web component tools with Data Binding, Template Engine and Virtual Dom.
She support Deno, Web browsers and Node.js


## What is Beako?



``` ts
const data = {
  value: 1
}

watch(data)

hack('#app', '<span>{{ value }}</span>', data)
```

## Usage

### CDN

``` html
<script type="module">
import { ... } as website from "beako.js";
</script>
```

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

``` ts
import { compact, watch } from 'beako/mod.ts'

const data = {
  value: 1
}

const component = compact('{{ value }}', [watch(data)])
```

``` html
<div @if="a === 2"></div>
<div @else @if="a"></div>
<div @else></div>

<a onclick="">Click me</a>

<div @for="items" @each="item"></div>

<div @try></div>
<div @catch="error"></div>

<group></group>

<header props*="{ props }"></header>

<beako-entity component:=""></beako-entity>

<slot name=""></slot>

<c>
  <span slot="header">
  </span>
  <span @as="header">
  </span>
</c>

<span @expand="content"></span>

<div class="button" class+="active && 'active'" style+=""></div>
  
          <template @elseif="prioritize(key, 'type') === 'space'"></template>
          <a
            class="key"
            class+="key.isOver && 'over'"
            class+="key.isAlt && 'alt'"
            class+="key.isSelected && 'select'"
            style+=""
            href:="url"
            value*="name"
            onmousedown="mousedown(event, key)"
            onmousedown+="event.preventDefault()"
            onmouseup="press(event, key)"
            ontouchstart="touchstart(event, key)"
            ontouchmove="touchmove(event, key)"
            ontouchend="touchend(event, key)"
            @elseif="state.shift.x === null && state.shift.y === null || key.unshift"
          >

<select onchange="value = event.target.value">
  <option value:=""></option>
  <option @for="options" @each="option" value:="option">{{ option }}</option>
</select>

<radiogroup value*="checked">
  <radio @for="options" @each="option" value:="option">{{ option }}</radio>
</radiogroup>

<checkbox value*="checked">Jack</checkbox>

<textarea value*="checked"></textarea>

<textbox type="" value*="checked">
  
<checkgroup value*="checkedNames">
  <checkbox value:="'Jack'">Jack</checkbox>
  <checkbox value:="'Jack'">Jack</checkbox>
  <checkbox value:="'Jack'">Jack</checkbox>
</checkgroup>
```

``` ts
import { create } from 'beako/mod.ts'

const html = `{{ value }}`
const template = parse(html)

const component = compact(tree, {
  value: 1
})
```

``` ts
import { compact, watch, receive } from 'beako/mod.ts'

const component = compact('{{ data.value }}',
  async ({ props, lifecycle }) => {
    const { id, value } = await receive(props, ['id', 'value'])

    watch(props, 'id', () => {
    })
    
    watch(lifecycle, 'connected', () => {
    })

    listen('destroy', () => {
    })

    return [data]
  }
)
```

``` ts
import { compact } from 'beako/mod.ts'

const component = compact('{{ data.value }}',
  async ({ props, refs, root, watch, receive, el, listen, fire }) => {
    const { id, value } = await receive(props, ['id', 'value'])

    watch('name', name => {
      if (name) {
        fire('save', {})
      } else {
        
      }
    })

    listen('destroy', () => {
    })

    return [data]
  }
)
```

``` ts
import { compact, watch } from 'beako/mod.ts'

const data = {
  value: 1
}

hack(
  '.app', 
  '{{ fire(value) }}',
  props => [
    watch(data),
    {
      fire () {}
    },
    watch(props, 'unmount', () => {})
  ]
)
```
