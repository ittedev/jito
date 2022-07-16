import { StateStack } from './types.ts'

export function pickup(
  stack: StateStack,
  name: string
): unknown
{
  return pickupIndex(stack, name)[0]
}

export function pickupIndex(
  stack: StateStack,
  name: string,
  start: number = stack.length - 1
): [unknown | undefined, number]
{
  for (let i = start; i >= 0; i--) {
    if (name in stack[i]) return [stack[i][name], i]
  }
  return [undefined, -1]
}
