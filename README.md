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

const data = {
  value: 1
}

watch(data)

const component = compact('{{ data.value }}', { data })
```

``` ts
import { compact, watch } from 'bearko/mod.ts'

const data = {
  value: 1
}

watch(data)

const component = compact('{{ data.value }}', [data, { data }])
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

<header props+="{ props }"></header>

<header with+=""></header>

<slot name=""></slot>

<c>
  <span slot="header">
  </span>
</c>

<div class="button" class+="active && 'active'" style+1=""></div>
  
          <template @elseif="prioritize(key, 'type') === 'space'"></template>
          <a
            class="key"
            class+="key.isOver && 'over'"
            class+="key.isAlt && 'alt'"
            class+="key.isSelected && 'select'"
            style+=""
            href:="url"
            go:="url => name = url"
            value*="name"
            onmousedown+="e => mousedown(e, key)"
            onmousedown+stop="e => e.preventDefault()"
            onmouseup+="e => press(e, key)"
            ontouchstart+="e => touchstart(e, key)"
            ontouchmove+="e => touchmove(e, key)"
            ontouchend+="e => touchend(e, key)"
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
