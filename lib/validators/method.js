'use strict'

const { expect } = require('../util')

class MethodValidator {
  constructor ({
    method = expect('method')
  } = {}) {
    this.method = method
  }

  * validate (record, path, value) {
    try {
      yield * record[this.method](record, path, value)
    } catch (err) {
      yield err
    }
  }
}

module.exports = MethodValidator
