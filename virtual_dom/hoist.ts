import {
  VirtualTree,
  RealTarget,
  VirtualElement,
  VirtualNode
} from './types.ts'

export function hoist(
  tree: VirtualTree,
  callback: (el: VirtualElement | RealTarget) => boolean,
  _header = { children: [] as Array<VirtualNode> }
): VirtualTree
{
  if (tree.children) {
    tree.children = tree.children.filter(child => {
      if (typeof child === 'object') {
        if (callback(child)) {
          _header.children.push(child)
          return false
        } else if ('tag' in child) {
          hoist(child, callback, _header)
        }
      }
      return true
    })
    if (!tree.children.length) {
      delete tree.children
    }
  }
  return _header.children.length ? _header : {}
}
