import { eventTypes as symbol } from './types.ts'

let destroy = 'destroy'
let patch = 'patch'


if (!(symbol in window)) {
  Object.defineProperty(window, symbol, {
    value: Object.seal({
      get destroy(): string { return destroy },
      set destroy(value: string) { destroy = value },
      get patch(): string { return patch },
      set patch(value: string) { patch = value }
    })
  })
}

// deno-lint-ignore no-explicit-any
export let eventTypes = (window as any)[symbol] as { destroy: string, patch: string }
