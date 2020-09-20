'use strict'

const { expect } = require('../util')

class LengthIsValidator {
  constructor ({
    length = expect('length'),
    error = `does not have length of ${length}`
  } = {}) {
    this.length = length
    this.error = error
  }

  * validate (record, path, value) {
    if (value.length !== this.length) {
      yield this.error
    }
  }
}

module.exports = LengthIsValidator
