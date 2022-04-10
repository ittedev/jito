// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { isLocked } from './types.ts'

export function unlock<T>(obj: T): T
{
  delete (obj as Record<PropertyKey, unknown>)[isLocked]
  return obj
}
