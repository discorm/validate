'use strict'

const { expect } = require('../util')

class LengthMinValidator {
  constructor ({
    min = expect('min'),
    error = `should have a length of at least ${min}`
  } = {}) {
    this.min = min
    this.error = error
  }

  * validate (record, path, value) {
    if (value.length < this.min) {
      yield this.error
    }
  }
}

module.exports = LengthMinValidator
