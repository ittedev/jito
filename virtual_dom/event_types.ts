// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
let destroy = 'destroy'
let patch = 'patch'

export const eventTypes = Object.seal({
  get destroy(): string { return destroy },
  set destroy(value: string) {
    if (typeof value === 'string' && value !== '') {
      destroy = value
    } else {
      throw Error('Event type must be string')
    }
  },
  
  get patch(): string { return patch },
  set patch(value: string) {
    if (typeof value === 'string' && value !== '') {
      patch = value
    } else {
      throw Error('Event type must be string')
    }
  }
})
