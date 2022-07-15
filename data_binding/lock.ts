import { isLocked } from './types.ts'

export function lock<T>(obj: T): T
{
  (obj as Record<PropertyKey, unknown>)[isLocked] = true
  return obj
}
