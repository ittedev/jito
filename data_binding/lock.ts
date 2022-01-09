// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { isLocked } from './types.ts'

export function lock<T>(obj: T): T {
  (obj as Record<PropertyKey, unknown>)[isLocked] = true
  return obj
}
