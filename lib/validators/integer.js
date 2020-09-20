'use strict'

const FormatValidator = require('./format')

class IntegerValidator extends FormatValidator {
  constructor ({
    format = /^\d+$/,
    error = 'is not an integer'
  } = {}) {
    super({ format, error })
  }
}

module.exports = IntegerValidator
