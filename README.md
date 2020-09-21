# @disco/validate

[![CI status](https://github.com/discorm/validate/workflows/ci/badge.svg)](https://github.com/discorm/validate/actions?query=workflow%3Aci+branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/discorm/validate/badge.png)](https://coveralls.io/r/discorm/validate)

Builds a reusable schema validator using nested objects and functions to
describe the expected structure.

## Install

```sh
npm install @disco/validate
```

## Usage

```js
const validate = require('@disco/validate')

const validator = validate(t => {
  // Must be an object
  t.type('object')
  t.required()

  // Must have accepted: true
  t.validates('accepted', t => {
    t.type('boolean')
    t.acceptance()
  })

  // Must have alpha-numeric name without bad words,
  // between 6 and 255 characters, and starting with a letter
  t.validates('name', t => {
    t.type('string')
    t.alphanum()
    t.excludes(badWords, 'bad words are not allowed!')
    t.minLength(6)
    t.maxLength(255)
    t.notEmpty()

    t.function((record, path, value) => {
      if (/[a-z]/i.test(value[0])) {
        throw new Error('name must not start with a number')
      }
    })
  })

  // Balance must be a decimal number
  t.validates('balance', t => {
    t.type('number')
    t.required()
    t.decimal()

    // Use this if it should be a numeric but in a string
    t.numeric()
  })

  // Must have valid email
  t.validates('email', t => {
    t.type('string')
    t.required()
    t.email()
  })

  // May have a birthdate following DD-MM-YYYY format
  t.validates('birthdate', t => {
    t.format(/^\d{2}-\d{2}-\d{4}$/)
    t.type('string')
    t.isLength(10)
  })

  // May be a business workday
  t.validates('weekday', t => {
    t.includes([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday'
    ])
  })

  // May be an integer
  t.validates('count', t => {
    t.type('number')
    t.integer()
  })

  // May be a postal code
  t.validates('postalCode', t => {
    t.postalCode()
  })

  // May be a zip code
  t.validates('zipCode', t => {
    t.zipCode()
  })

  // Pass if calling record.yep() returns true
  t.when('yep')

  // Pass if calling record.nope() returns false
  t.unless('nope')

  // Run a validation function for each path
  const strings = ['count','balance']
  t.validatesEach(strings, (record, path, value) => {
    if (0 > value) {
      throw new Error(`${path} must be positive`)
    }
  })

  // Pass if record.check() does not generate errors
  t.method('check')
})

const data = {
  name: 'Stephen',
  accepted: true,
  balance: 1234.56,
  email: 'me@example.com',
  birthdate: '11-11-1111',
  weekday: 'Tuesday',
  count: 123,
  postalCode: 'A1B 2C3',
  zipCode: '12345',
  yep() {
    return true
  },
  nope() {
    return false
  },
  * check () {
    yield 'this is an error'
  }
}

for await (const error of validator.validate(data)) {
  console.error(error)
}
```

## License

[MIT](./LICENSE)