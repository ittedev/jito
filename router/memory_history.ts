// deno-lint-ignore-file no-explicit-any
import { MemoryHistoryStateEvent } from './type.ts'

export class MemoryHistory implements History {
  private _historyStack: [string, any][] = [['', null]]
  private _currentIndex = 0
  private _handlers = new Map<'reload' | 'popstate', Set<(event: MemoryHistoryStateEvent) => void>>()
  public scrollRestoration: 'auto' | 'manual' = 'auto'

  public get length() {
    return this._historyStack.length
  }

  public get state(): any {
    if (this._historyStack.length) {
      return this._historyStack[this._currentIndex][1]
    } else {
      return null
    }
  }

  public go(delta: number) {
    setTimeout(() => {
      if (delta !== 0) {
        let index = Math.min(Math.max(this._currentIndex + delta, 0), this._historyStack.length - 1)
        if (this._currentIndex !== index) {
          this._dispatchEvent({
            type: 'popstate',
            state: this._historyStack[index]
          } as MemoryHistoryStateEvent)
        }
        this._currentIndex = index
      } else if (this._historyStack.length) {
        this._dispatchEvent({
          type: 'reload',
          state: this._historyStack[this._currentIndex]
        } as MemoryHistoryStateEvent)
      }
    }, 1)
  }

  public back()
  {
    this.go(-1)
  }

  public forward(): void
  {
    this.go(1)
  }

  public pushState(state: any, _unused: string, url: string)
  {
    this._historyStack.splice(this._currentIndex + 1, this._historyStack.length - this._currentIndex - 1, [url, state])
    this._currentIndex++
  }

  public replaceState(state: any, _unused: string, url: string)
  {
    this._historyStack.splice(this._currentIndex, this._historyStack.length - this._currentIndex, [url, state])
  }

  public addEventListener(type: 'reload' | 'popstate', listener: (event: MemoryHistoryStateEvent) => void)
  {
    if (!this._handlers.has(type)) {
      this._handlers.set(type, new Set())
    }
    (this._handlers.get(type) as Set<(event: MemoryHistoryStateEvent) => void>).add(listener)
  }

  public removeEventListener(type: 'reload' | 'popstate', listener: (event: MemoryHistoryStateEvent) => void)
  {
    if (!this._handlers.has(type)) {
      return
    }
    (this._handlers.get(type) as Set<(event: MemoryHistoryStateEvent) => void>).delete(listener)
  }

  private _dispatchEvent(event: MemoryHistoryStateEvent) {
    let handlers = this._handlers.get(event.type)
    if (handlers) {
      let isFinish = false
      let stopImmediatePropagation = () => {
        isFinish = true
      }
      for (let handler of handlers) {
        handler({
          ...event,
          stopImmediatePropagation,
        })
        if (isFinish) {
          break
        }
      }
    }
  }
}
