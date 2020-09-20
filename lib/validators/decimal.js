'use strict'

const FormatValidator = require('./format')

class DecimalValidator extends FormatValidator {
  constructor ({
    format = /^((\d+)?\.\d+|\d+\.)$/,
    error = 'is not a decimal number'
  } = {}) {
    super({ format, error })
  }
}

module.exports = DecimalValidator
