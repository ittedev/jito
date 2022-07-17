import { lock } from '../data_binding/lock.ts'

export let builtin = lock({
  alert,
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
  history,
  navigator,
  setTimeout,
  setInterval
})
