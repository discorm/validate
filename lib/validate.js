'use strict'

const AsyncValueValidator = require('./validators/async')
const ValueValidator = require('./validators/value')

function validate (run) {
  return new ValueValidator({ run })
}

function validateAsync (run) {
  return new AsyncValueValidator({ run })
}

validate.validateAsync = validateAsync
validate.async = validateAsync
module.exports = validate
