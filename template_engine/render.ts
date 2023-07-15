import {
  VirtualTree,
  VirtualNode,
  VirtualElement
} from '../virtual_dom/types.ts'
import { notHasEnd } from './is_primitive.ts'

export function render(tree: VirtualTree): string
{
  return tree.children ? renderChildren(tree.children) : ''
}

// Not support RealTarget
function renderChildren(children: VirtualNode[]): string
{
  return children
    .filter(child => typeof child !== 'number')
    .map(child => typeof child === 'string' ? child : renderElement(child as VirtualElement))
    .join('')
}

function renderElement(ve: VirtualElement): string
{
  let idSection = ve.is ? ` is="${ve.is}"` : ''
  let classSection = ve.class ? ` class="${ve.class.join(' ')}"` : ''
  let partSection = ve.part ? ` part="${ve.part.join(' ')}"` : ''
  let styleSection = ve.style ? ` style="${ve.style}"` : ''
  let attrsSection = ve.attrs ? Object.entries(ve.attrs).map(attr => ` ${attr[0]}="${attr[1]}"`).join('') : ''
  let childrenSection = ve.children ? renderChildren(ve.children) : ''
  return '<' + ve.tag + idSection + classSection + partSection + styleSection + attrsSection + `>${notHasEnd(ve.tag) ? '' : `${childrenSection}</${ve.tag}>`}`
}