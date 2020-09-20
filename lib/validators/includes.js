'use strict'

const { expect } = require('../util')

class IncludesValidator {
  constructor ({
    list = expect('list'),
    error = `should be one of: ${list.join(', ')}`
  } = {}) {
    this.list = list
    this.error = error
  }

  * validate (record, path, value) {
    if (!this.list.includes(value)) {
      yield this.error
    }
  }
}

module.exports = IncludesValidator
