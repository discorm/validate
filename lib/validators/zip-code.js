'use strict'

const FormatValidator = require('./format')

class ZipCodeValidator extends FormatValidator {
  constructor ({
    format = /^\d{5}$/,
    error = 'is not a valid zip code'
  } = {}) {
    super({ format, error })
  }
}

module.exports = ZipCodeValidator
