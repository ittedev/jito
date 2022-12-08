import { ComponentOptions, Component } from './types.ts'

/**
 * @alpha
 */
export function seal(
  component: Component,
  options: ComponentOptions = {}
): Component
{
  component.options = Object.freeze(Object.assign({ mode: 'closed' }, options))
  return Object.freeze(component)
}
