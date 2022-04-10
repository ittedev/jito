// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Variables } from './types.ts'

export function pickup(
  stack: Variables,
  name: string,
  start: number = stack.length - 1
): [unknown | undefined, number]
{
  for (let i = start; i >= 0; i--) {
    if (name in stack[i]) return [stack[i][name], i]
  }
  return [undefined, -1]
}
