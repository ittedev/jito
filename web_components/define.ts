// Copyright 2021 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export function define(name: string, template: string | TreeTemplate | Component, stack?: Variables): void {

  customElements.define(name, ExpandingList, { extends: "ul" });
}