'use strict'

const FormatValidator = require('./format')

class AlphaValidator extends FormatValidator {
  constructor ({
    format = /^[a-z]+$/i,
    error = 'is not alphabetic'
  } = {}) {
    super({ format, error })
  }
}

module.exports = AlphaValidator
