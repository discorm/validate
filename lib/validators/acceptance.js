'use strict'

class AcceptanceValidator {
  constructor ({
    error = 'is not accepted'
  } = {}) {
    this.error = error
  }

  * validate (record, path, value) {
    if (value !== true) {
      yield this.error
    }
  }
}

module.exports = AcceptanceValidator
