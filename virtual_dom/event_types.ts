import { eventTypes as symbol } from './types.ts'

let destroy = 'destroy'
let patch = 'patch'

declare global {
  interface Window {
    [symbol]: { destroy: string, patch: string }
  }
}

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

export const eventTypes = window[symbol]
