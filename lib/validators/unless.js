'use strict'

const { expect } = require('../util')

class UnlessValidator {
  constructor ({
    method = expect('method'),
    error = `expected to fail ${method} method`
  } = {}) {
    this.method = method
    this.error = error
  }

  * validate (record, path, value) {
    const fn = record[this.method]
    if (typeof fn !== 'function') {
      yield this.error
      return
    }

    try {
      if (fn.call(record, record, path, value)) {
        yield this.error
      }
    } catch (err) {
      yield err
    }
  }
}

module.exports = UnlessValidator
