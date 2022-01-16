// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
export function html(templates: TemplateStringsArray): string {
  return templates.raw[0]
}
