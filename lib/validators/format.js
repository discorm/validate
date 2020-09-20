'use strict'

const { expect } = require('../util')

class FormatValidator {
  constructor ({
    format = expect('format'),
    error = 'does not match regex'
  } = {}) {
    this.format = format
    this.error = error
  }

  * validate (record, path, value) {
    if (!this.format.test(value)) {
      yield this.error
    }
  }
}

module.exports = FormatValidator
