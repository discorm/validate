'use strict'

function isGenerator (value) {
  return (
    typeof value === 'function' &&
    value.constructor &&
    /^(Async)?GeneratorFunction$/.test(value.constructor.name)
  ) || /^\[object (Async)?GeneratorFunction\]$/.test(Object.prototype.toString.call(value))
}

function isValidator (validator) {
  return validator && isGenerator(validator.validate)
}

function expect (field) {
  throw new Error(`expected "${field}" field`)
}

module.exports = {
  expect,
  isGenerator,
  isValidator
}
