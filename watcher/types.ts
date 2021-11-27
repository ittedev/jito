export const dictionary = Symbol()

// deno-lint-ignore no-explicit-any
export type Callback = (newValue: any, oldValue: any) => void

export interface DictionaryPage {
  v: unknown
  f: Set<Callback>
}

export interface Dictionary {
  [key: string]: DictionaryPage
}

export interface BearkoObject {
  [key: string]: unknown
  [dictionary]: Dictionary
}
