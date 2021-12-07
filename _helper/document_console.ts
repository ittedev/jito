let parent = document.body

// deno-lint-ignore no-explicit-any
export function log(id: string, ...args: any[]) {
  console.log(id, ...args)
  const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')
  parent.insertAdjacentHTML('beforeend', `<dt style="margin-bottom: 10px"><b>#${id}</b></dt><dd id="${id}" style="margin-bottom: 20px">${text}</dd>`)
}

export function test(title: string, f: () => void) {
  const text = 'test ' + title
  console.log('\n\n%c ' + text + ' ', 'border: 1px solid grey; color: blue')
  const fieldset = document.createElement('fieldset')
  fieldset.style.marginBottom = '50px'
  fieldset.insertAdjacentHTML('beforeend', '<legend style="color: blue"><b>' + text + '</b></legend>')
  const dl = document.createElement('dl')
  fieldset.insertAdjacentElement('beforeend', dl)
  parent = dl
  f()
  parent = document.body
  document.body.append(fieldset)
}
