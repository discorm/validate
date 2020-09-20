'use strict'

const FormatValidator = require('./format')

class AlphaNumValidator extends FormatValidator {
  constructor ({
    format = /^\w+$/,
    error = 'is not alphanumeric'
  } = {}) {
    super({ format, error })
  }
}

module.exports = AlphaNumValidator
