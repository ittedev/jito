// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { isLocked } from './types.ts'

export function lock(obj: unknown): unknown {
  (obj as Record<PropertyKey, unknown>)[isLocked] = true
  return obj
}
