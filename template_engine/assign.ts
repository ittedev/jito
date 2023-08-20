import { StateStack } from './types.ts'
import { pickupIndex } from './pickup.ts'

export function assign(
  stack: StateStack,
  name: string,
  value: unknown
): void
{
  let [, index] = pickupIndex(stack, name)
  if (index > 0 && name in stack[index]) {
    stack[index][name] = value
  } else {
    throw Error('Variable "' + name + '" is missing.')
  }
}