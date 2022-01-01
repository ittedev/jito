// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { Component } from './component.ts'

export const entityTag = 'beako-entity'

// TODO: beako-entity
class BeakoEntity extends Component {
}

customElements.define(entityTag, BeakoEntity)
