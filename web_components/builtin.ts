// Copyright 2022 itte.dev. All rights reserved. MIT license.
// This module is browser compatible.
import { lock } from '../data_binding/lock.ts'

export const builtin = lock({
  console,
  Object,
  Number,
  Math,
  Date,
  Array,
  JSON,
  String,
  isNaN,
  isFinite,
  location,
  alert
}) as Record<string, unknown>
