# bearko

``` ts
import { hack, watch } from 'bearko/client.ts'

const data = {
  value: 1
}

hack('.app', '{{ value }}', data)
```

``` ts
import { compact, watch } from 'bearko/mod.ts'

const data = watch({
  value: 1
})

const component = compact('{{ data.value }}', { data })
```

``` ts
import { compact, watch } from 'bearko/mod.ts'

const data = {
  value: 1
}

const component = compact('{{ value }}', [watch(data)])
```

``` html
<div @if="a"></div>
<div @elseif="a"></div>
<div @else></div>

<a click!="">Click me</a>

<region @switch="">
  <div @case="">
  <div @case="">
  <div @default>
</region>

<div @each="item" @of="items"></div>

<div @try="items">
  <div @each="item"></div>
</div>
<div @catch></div>

<div @try></div>
<div @catch></div>

<header props*="{ props }"></header>

<header with*=""></header>

<slot name=""></slot>

<c>
  <span slot="header">
  </span>
</c>

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

<selectbox @of="options" value*="checked">
  <option value:=""></option>
  <option @each="option" value:="option">{{ option }}</option>
</selectbox>

<radiogroup @of="options" value*="checked">
  <radio @each="option" value:="option">{{ option }}</radio>
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
import { create } from 'bearko/mod.ts'

const html = `{{ value }}`
const template = parse(html)

const component = compact(tree, {
  value: 1
})
```

``` ts
import { compact, watch } from 'bearko/mod.ts'

const component = compact(
  '{{ data.value }}',
  props => {
    const data = watch({
      value: 1
    })

    watch(props, 'name', value => {
    })

    watch(props, 'unmount', () => {
    })

    return [data]
  }
)
```

``` ts
import { compact, watch } from 'bearko/mod.ts'

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
