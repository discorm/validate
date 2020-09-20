'use strict'

class RequiredValidator {
  constructor ({
    error = 'is required'
  } = {}) {
    this.error = error
  }

  * validate (record, path, value) {
    if (value === null || value === undefined) {
      yield this.error
    }
  }
}

module.exports = RequiredValidator
