'use strict'

const FormatValidator = require('./format')

class EmailValidator extends FormatValidator {
  constructor ({
    format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    error = 'is not an email address'
  } = {}) {
    super({ format, error })
  }
}

module.exports = EmailValidator
