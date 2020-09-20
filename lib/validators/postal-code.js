'use strict'

const FormatValidator = require('./format')

class PostalCodeValidator extends FormatValidator {
  constructor ({
    format = /^([a-z]\s*\d\s*){3}$/,
    error = 'is not a valid postal code'
  } = {}) {
    super({ format, error })
  }
}

module.exports = PostalCodeValidator
