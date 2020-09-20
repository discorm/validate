'use strict'

const { isValidator } = require('../util')
const { ValidationError } = require('../errors')
const Path = require('dotpath')

const AcceptanceValidator = require('./acceptance')
const AlphaNumValidator = require('./alpha-num')
const AlphaValidator = require('./alpha')
const DecimalValidator = require('./decimal')
const EachValidator = require('./each')
const EmailValidator = require('./email')
const ExcludesValidator = require('./excludes')
const FormatValidator = require('./format')
const FunctionValidator = require('./function')
const IncludesValidator = require('./includes')
const IntegerValidator = require('./integer')
const LengthIsValidator = require('./length-is')
const LengthMaxValidator = require('./length-max')
const LengthMinValidator = require('./length-min')
const MethodValidator = require('./method')
const NotEmptyValidator = require('./not-empty')
const NumericValidator = require('./numeric')
const PostalCodeValidator = require('./postal-code')
const RequiredValidator = require('./required')
const TypeValidator = require('./type')
const UnlessValidator = require('./unless')
const WhenValidator = require('./when')
const ZipCodeValidator = require('./zip-code')

class ValueValidator extends Array {
  constructor ({ field, run } = {}) {
    // NOTE: Prevent options object from being stored in the array
    super()
    this.field = field

    if (isValidator(run)) {
      this.push(run)
    } else if (typeof run === 'function') {
      run.call(this, this)
    }
  }

  * validate (record, path, value) {
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
      const { name } = validator.constructor
      const errors = validator.validate(record, path, value)

      if (validator instanceof ValueValidator) {
        yield * errors
        continue
      }

      for (const error of errors) {
        yield new ValidationError(error, path, name)
      }
    }
  }

  when (method, options) {
    this.push(new WhenValidator({ method, ...options }))
  }

  unless (method, options) {
    this.push(new UnlessValidator({ method, ...options }))
  }

  method (method, options) {
    this.push(new MethodValidator({ method, ...options }))
  }

  notEmpty (options) {
    this.push(new NotEmptyValidator(options))
  }

  type (type, options) {
    this.push(new TypeValidator({ type, ...options }))
  }

  isLength (length, options) {
    this.push(new LengthIsValidator({ length, ...options }))
  }

  minLength (min, options) {
    this.push(new LengthMinValidator({ min, ...options }))
  }

  maxLength (max, options) {
    this.push(new LengthMaxValidator({ max, ...options }))
  }

  acceptance (options) {
    this.push(new AcceptanceValidator(options))
  }

  includes (list, options) {
    this.push(new IncludesValidator({ list, ...options }))
  }

  excludes (list, options) {
    this.push(new ExcludesValidator({ list, ...options }))
  }

  validatesWith (run, options) {
    this.push(new FunctionValidator({ run, ...options }))
  }

  validatesEach (list, run, options) {
    this.push(new EachValidator({ run, list, ...options }))
  }

  validates (field, run) {
    this.push(new ValueValidator({ run, field }))
  }

  format (format, options = {}) {
    this.push(new FormatValidator({ format, ...options }))
  }

  email (options) {
    this.push(new EmailValidator(options))
  }

  alpha (options) {
    this.push(new AlphaValidator(options))
  }

  alphanum (options) {
    this.push(new AlphaNumValidator(options))
  }

  integer (options) {
    this.push(new IntegerValidator(options))
  }

  decimal (options) {
    this.push(new DecimalValidator(options))
  }

  numeric (options) {
    this.push(new NumericValidator(options))
  }

  postalCode (options) {
    this.push(new PostalCodeValidator(options))
  }

  zipCode (options) {
    this.push(new ZipCodeValidator(options))
  }

  required (options) {
    this.push(new RequiredValidator(options))
  }
}

module.exports = ValueValidator
