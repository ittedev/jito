import {
  ReactiveObject,
  instanceOfReactivableObject,
} from './types.ts'
import { reactivate, addReactive } from './watch.ts'

/**
 * @deprecated
 */
export async function receive(data: unknown, ...keys: string[]): Promise<Record<string, unknown>>
export async function receive(data: unknown, keys: string[]): Promise<Record<string, unknown>>
export async function receive(data: unknown, ...keys: string[] | string[][]): Promise<Record<string, unknown>>
{
  if (instanceOfReactivableObject(data)) {
    reactivate(data)
    let keys2 = Array.isArray(keys[0]) ?
      (keys as string[][]).reduce<string[]>((ary, k) => { // flatMap(k => k)
        ary.push(...k)
        return ary
      }, []) :
      keys as string[]
    let values = await Promise.all(keys2.map(key => {
      if ((data as ReactiveObject)[key] === undefined) {
        return new Promise(resolve => {
          addReactive(data as ReactiveObject, key, ['bom', resolve])
        })
      } else {
        return (data as ReactiveObject)[key]
      }
    }))
    return keys2.reduce<Record<string, unknown>>((obj, key, index) => {
      obj[key] = values[index]
      return obj
    }, {})
    // return Object.fromEntries(keys2.map((key, index) => [key, values[index]]))
  }
  return {}
}
