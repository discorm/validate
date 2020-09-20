'use strict'

const Path = require('dotpath')
const { ValidationError } = require('../errors')
const ValueValidator = require('./value')

class AsyncValueValidator extends ValueValidator {
  async * validate (record, path, value) {
    if (!path) path = new Path()
    if (arguments.length < 3) {
      value = path.navigate(record)
    }

    const { field } = this
    if (field) {
      path = path.concat(field)
      if (value) {
        value = value[field]
      }
    }

    for (const validator of this) {
      const alreadyWrapped = validator instanceof ValueValidator
      const errors = validator.validate(record, path, value)
      const { name } = validator.constructor

      for await (let error of errors) {
        if (!alreadyWrapped) {
          error = new ValidationError(error, path, name)
        }
        yield error
      }
    }
  }

  validates (field, run) {
    this.push(new AsyncValueValidator({ run, field }))
  }
}

module.exports = AsyncValueValidator
