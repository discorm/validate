'use strict'

const { expect } = require('../util')

class LengthMaxValidator {
  constructor ({
    max = expect('max'),
    error = `should have a length of at most ${max}`
  } = {}) {
    this.max = max
    this.error = error
  }

  * validate (record, path, value) {
    if (value.length > this.max) {
      yield this.error
    }
  }
}

module.exports = LengthMaxValidator
