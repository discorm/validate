'use strict'

class ValidationError extends Error {
  constructor (message, path, validator) {
    super(`${path} ${message}`)
    this.shortMessage = message
    this.validator = validator
    this.path = path
  }

  toString () {
    return `${this.validator}: "${this.path}" ${this.shortMessage}`
  }
}

module.exports = {
  ValidationError
}
