export let builtin = Object.freeze({
  alert,
  console,
  Object: Object.freeze({
    // assign: Object.assign, <- prototype pollution
    entries: Object.entries,
    fromEntries: Object.fromEntries,
    hasOwn: Object.hasOwn,
    is: Object.is,
    keys: Object.keys,
    values: Object.values
  }),
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
  structuredClone: typeof structuredClone !== 'undefined' ? structuredClone : undefined,
})
