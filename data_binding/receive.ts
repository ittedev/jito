import { isLocked, BeakoObject } from './types.ts'
import { pollute } from './watch.ts'

export async function receive(obj: BeakoObject, ...keys: string[]): Promise<Record<string, unknown>>
export async function receive(obj: BeakoObject, keys: string[]): Promise<Record<string, unknown>>
export async function receive(obj: BeakoObject, ...keys: string[] | string[][]): Promise<Record<string, unknown>>
{
  if (!obj[isLocked]) {
    const keys2 = Array.isArray(keys[0]) ? (keys as string[][]).flatMap(k => k) : keys as string[]
    const values = await Promise.all(keys2.map(key => {
      if (obj[key] === undefined) {
        return new Promise(resolve => {
          pollute(obj, key, ['bom', resolve])
        })
      } else {
        return obj[key]
      }
    }))
    return keys2.reduce((obj, key, index) => {
      obj[key] = values[index]
      return obj
    }, {} as Record<string, unknown>)
    // return Object.fromEntries(keys.map((key, index) => [key, values[index]]))
  }
  return {}
}
