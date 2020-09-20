'use strict'

const FormatValidator = require('./format')

class NumericValidator extends FormatValidator {
  constructor ({
    format = /^(\d*(\.)?\d+|\d+(\.)?\d*)$/,
    error = 'is not numeric'
  } = {}) {
    super({ format, error })
  }
}

module.exports = NumericValidator
