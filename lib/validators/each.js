'use strict'

const { expect } = require('../util')
const FunctionValidator = require('./function')

class EachFunctionValidator extends FunctionValidator {
  constructor ({
    list = expect('list'),
    ...options
  } = {}) {
    super(options)
    this.list = list
  }

  * validate (record, path, value) {
    for (const item of this.list) {
      const itemPath = path.concat(item)
      const itemValue = path.navigate(record)
      yield * super.validate(record, itemValue, itemPath)
    }
  }
}

module.exports = EachFunctionValidator
