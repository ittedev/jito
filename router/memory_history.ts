// deno-lint-ignore-file no-explicit-any
export class MemoryHistory extends History {
  private _historyStack: [string, any][] = []
  private _currentIndex = -1

  public get state(): any {
    if (this._historyStack.length) {
      return this._historyStack[this._currentIndex]
    } else {
      return null
    }
  }

  public go(delta: number) {
    if (delta !== 0) {
      this._currentIndex = Math.max(Math.min(this._currentIndex + delta, 0), this._historyStack.length - 1)
    }
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
}
