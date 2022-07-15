import { isLocked } from './types.ts'

export function unlock<T>(obj: T): T
{
  delete (obj as Record<PropertyKey, unknown>)[isLocked]
  return obj
}
