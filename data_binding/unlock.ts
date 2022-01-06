// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { isLocked } from './types.ts'

export function unlock(obj: unknown): unknown {
  delete (obj as Record<PropertyKey, unknown>)[isLocked]
  return obj
}
