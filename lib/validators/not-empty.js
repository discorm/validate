'use strict'

class NotEmptyValidator {
  constructor ({
    error = 'is empty'
  } = {}) {
    this.error = error
  }

  * validate (record, path, value) {
    if (!value || value.length < 1) {
      yield this.error
    }
  }
}

module.exports = NotEmptyValidator
