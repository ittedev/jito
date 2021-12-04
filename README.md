# bearko

``` ts
import { hack, watch } from 'bearko/client.ts'

const data = {
  value: 1
}

hack('.app', '{{ value }}', { $var: data })
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
<div @if="a"></div>
<div @elseif="a"></div>
<div @else></div>

<a click!="">Click me</a>

<temp @switch="">
  <div @case="">
  <div @case="">
  <div @default>
</temp>

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
            href:="url"
            value*="name"
            mousedown!="e => mousedown(e, key)"
            mouseup!="e => press(e, key)"
            touchstart!="e => touchstart(e, key)"
            touchmove!="e => touchmove(e, key)"
            touchend!="e => touchend(e, key)"
            style+=""
            @elseif="state.shift.x === null && state.shift.y === null || key.unshift"
          >
```

``` ts
import { create } from 'bearko/client.ts'

const html = `{{ value }}`
const css = ``
const tree = parse(html)

const component = create(tree, {
  value: 1
})
```
