'use strict'

const { expect } = require('../util')

class TypeValidator {
  constructor ({
    type = expect('type'),
    error = `is not a ${type} type`
  } = {}) {
    this.type = type
    this.error = error
  }

  * validate (record, path, value) {
    const type = typeof value
    if (type !== this.type) {
      yield this.error
    }
  }
}

module.exports = TypeValidator
