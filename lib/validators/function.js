'use strict'

const { expect, isGenerator } = require('../util')

class FunctionValidator {
  constructor ({
    run = expect('run'),
    ...options
  } = {}) {
    this.run = run
    this.options = options
    this.isGenerator = isGenerator(run)
  }

  * validate (record, path, value) {
    if (this.isGenerator) {
      yield * this.run(record, path, value, this.options)
    } else {
      try {
        this.run(record, path, value, this.options)
      } catch (err) {
        yield err
      }
    }
  }
}

module.exports = FunctionValidator
