// deno-lint-ignore no-explicit-any
export function log(id: string, ...args: any[]) {
  console.log(id, ...args)
  const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')
  const p = document.createElement('p')
  p.id = id
  p.innerHTML = text
  document.body.append(p)
}
