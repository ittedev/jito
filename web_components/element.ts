import type { Component } from './types.ts'
import { instanceOfComponent } from './types.ts'
import { load } from '../virtual_dom/load.ts'
import { Entity } from './entity.ts'

export let componentElementTag = 'jito-element'

export class ComponentElement extends HTMLElement
{
  private _entity?: Entity
  private _run?: (value: void | PromiseLike<void>) => void

  constructor()
  {
    super()
  }

  setAttr(name: string, value: unknown): void
  {
    if (this._entity) {
      this._entity.setAttr(name, value)
    }
  }

  static getComponent(): Component | undefined
  {
    return undefined
  }

  loadAttrs(): void
  {
    if (this.hasAttributes()) {
      this.getAttributeNames().forEach(name => {
        this.setAttr(name, this.getAttribute(name))
      })
    }
  }

  ready(): Promise<void>
  {
    if (this._entity) {
      return this._entity.ready()
    } else {
      return new Promise<void>(resolve => {
        this._run = resolve
      })
    }
  }

  protected _setEntity(entity: Entity)
  {
    this._entity = entity
    if (this._run) {
      this._entity.ready().then(this._run)
    }
  }

  get entity(): Entity | undefined
  {
    return this._entity
  }

  // overrides

  get attributes(): NamedNodeMap
  {
    return proxyNamedNodeMap(super.attributes, this.setAttr)
  }

  setAttribute(name: string, value: unknown)
  {
    this.setAttr(name, value)
    super.setAttribute(name, value as string)
  }

//   getAttribute(name: string): string | null  // Actually unknown
//   {
//     if (this._entity && name in this._entity.attrs) { // why true?
//       return this._entity.attrs[name] as string
//     } else {
//       return super.getAttribute(name)
//     }
//   }

  getAttributeNode(name: string): Attr | null
  {
    let attr = super.getAttributeNode(name)
    return attr ? proxyAttr(attr, this.setAttr) : attr
  }

  removeAttribute(name: string)
  {
    this.setAttr(name, undefined)
    return super.removeAttribute(name)
  }

  removeAttributeNode(attr: Attr)
  {
    this.setAttr(attr.name, undefined)
    return super.removeAttributeNode(attr)
  }

  toJSON() {
    return {
      entity: this._entity
    }
  }

  // not spport
  // getAttributeNodeNS()
  // ARIAMixin
}

class GrobalComponentElement extends ComponentElement
{
  constructor() {
    super()
  }

  setAttr(name: string, value: unknown)
  {
    // if change a component property
    if (name === 'component') {
      switch (typeof value) {
        case 'string': {
          let def = customElements.get(value)
          // deno-lint-ignore no-prototype-builtins
          if (def && ComponentElement.isPrototypeOf(def)) {
            let component = (def as typeof ComponentElement).getComponent()
            if (component) {
              if (this.entity) {
                this.entity.destroy(true)
              }
              let tree = this.entity ? this.entity.tree : load(this.attachShadow(component.options))
              this._setEntity(new Entity(component, this, tree))
            }
          } else {
            throw Error(value + ' is not a component.')
          }
          break
        }
        case 'object':
          if (instanceOfComponent(value)) {
            if (this.entity) {
              this.entity.destroy(true)
            }
            let tree = this.entity ? this.entity.tree : load(this.attachShadow(value.options))
            this._setEntity(new Entity(value, this, tree))
          } else if (value !== null) {
            throw Error('The object is not a component.')
          }
          break
      }
    }
    super.setAttr(name, value)
  }
}

if (!customElements.get(componentElementTag)) {
  customElements.define(componentElementTag, GrobalComponentElement)
}

function proxyAttr(attr: Attr, setAttr: (name: string, value: unknown) => void)
{
  return new Proxy(attr, {
    set(target, attr, value) {
      setAttr(attr as string, value)
      if (attr === 'value') {
        return target.value = value
      }
    }
  })
}

function proxyNamedNodeMap(
  attrs: NamedNodeMap,
  setAttr: (name: string, value: unknown) => void
)
{
  return new Proxy(attrs, {
    get: function (target, attr) {
      if (attr === 'length') {
        return target[attr]
      } else {
        return proxyAttr(target[attr as unknown as number] as Attr, setAttr)
      }
    }
  })
}