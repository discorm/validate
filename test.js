'use strict'

const tap = require('tap')

const Path = require('dotpath')
const validate = require('./lib/validate')
const { ValidationError } = require('./lib/errors')

async function expectErrors (t, validator, record, expected) {
  t.comment(JSON.stringify(record))

  const errors = []
  for await (const error of validator.validate(record)) {
    errors.push(error)
  }

  if (errors.length !== expected.length) {
    t.fail('error count does not match expectation')
    return
  }

  if (!expected.length) {
    t.pass('has no errors')
    return
  }

  for (const error of expected) {
    const received = errors.shift()
    t.equal(received.toString(), error.toString(), `error matches (${error.toString()})`)
  }
}

const tests = [
  {
    name: 'acceptance',
    passes: [true],
    fails: [false],
    shortMessage: 'is not accepted',
    validator: 'AcceptanceValidator'
  },
  {
    name: 'alphanum',
    passes: ['abcefghijklmnopqrstuvwxyz1234567890_'],
    fails: '!@#$%^&*()+-={}|[]\\:";\'<>?,./`~'.split(''),
    shortMessage: 'is not alphanumeric',
    validator: 'AlphaNumValidator'
  },
  {
    name: 'alpha',
    passes: ['abcefghijklmnopqrstuvwxyz'],
    fails: '1234567890'.split(''),
    shortMessage: 'is not alphabetic',
    validator: 'AlphaValidator'
  },
  {
    name: 'decimal',
    passes: ['1.', '.1', '1.2'],
    fails: ['1', '1.2.3', 'one', 'one.2'],
    shortMessage: 'is not a decimal number',
    validator: 'DecimalValidator'
  },
  {
    name: 'email',
    passes: ['yep@example.com'],
    fails: ['nope'],
    shortMessage: 'is not an email address',
    validator: 'EmailValidator'
  },
  {
    name: 'excludes',
    input: ['nope'],
    passes: ['yep'],
    fails: ['nope'],
    shortMessage: 'should be none of: nope',
    validator: 'ExcludesValidator'
  },
  {
    name: 'format',
    input: /^[a-z]{3}\d{3}$/i,
    passes: ['abc123'],
    fails: ['ab1234', 'abcd12', 'abc 123'],
    shortMessage: 'does not match regex',
    validator: 'FormatValidator'
  },
  {
    name: 'includes',
    input: ['yep'],
    passes: ['yep'],
    fails: ['nope'],
    shortMessage: 'should be one of: yep',
    validator: 'IncludesValidator'
  },
  {
    name: 'integer',
    passes: ['1', '12345'],
    fails: ['1.2', '.1', '1.'],
    shortMessage: 'is not an integer',
    validator: 'IntegerValidator'
  },
  {
    name: 'isLength',
    input: 10,
    passes: ['1234567890'],
    fails: ['123456789', '12345678901'],
    shortMessage: 'does not have length of 10',
    validator: 'LengthIsValidator'
  },
  {
    name: 'maxLength',
    input: 10,
    passes: ['123456789', '1234567890'],
    fails: ['12345678901'],
    shortMessage: 'should have a length of at most 10',
    validator: 'LengthMaxValidator'
  },
  {
    name: 'minLength',
    input: 10,
    passes: ['1234567890', '12345678901'],
    fails: ['123456789'],
    shortMessage: 'should have a length of at least 10',
    validator: 'LengthMinValidator'
  },
  {
    name: 'method',
    input: 'test',
    passes: [{ * test () {} }],
    fails: [{ * test () { yield 'nope' } }],
    shortMessage: 'nope',
    validator: 'MethodValidator',
    skipCustom: true
  },
  {
    name: 'notEmpty',
    passes: ['yep', [1]],
    fails: ['', [], 0, false],
    shortMessage: 'is empty',
    validator: 'NotEmptyValidator'
  },
  {
    name: 'numeric',
    passes: ['1', '1.', '.1', '1.2'],
    fails: ['1.2.3', 'one', 'a2'],
    shortMessage: 'is not numeric',
    validator: 'NumericValidator'
  },
  {
    name: 'postalCode',
    passes: ['a1b2c3', 'a1b 2c3', 'a1 b2 c3', 'a 1 b 2 c 3'],
    fails: ['abc123', '123456', 'abcdef'],
    shortMessage: 'is not a valid postal code',
    validator: 'PostalCodeValidator'
  },
  {
    name: 'required',
    passes: ['', 1, true, false, /foo/, [], {}],
    fails: [undefined, null],
    shortMessage: 'is required',
    validator: 'RequiredValidator'
  },
  {
    name: 'type',
    input: 'string',
    passes: ['yep'],
    fails: [undefined, null, /nope/, 0, {}, []],
    shortMessage: 'is not a string type',
    validator: 'TypeValidator'
  },
  {
    name: 'unless',
    input: 'test',
    passes: [{ test () { return false } }],
    fails: [{ test () { return true } }, {}],
    shortMessage: 'expected to fail test method',
    validator: 'UnlessValidator'
  },
  {
    name: 'when',
    input: 'test',
    passes: [{ test () { return true } }],
    fails: [{ test () { return false } }, {}],
    shortMessage: 'expected to pass test method',
    validator: 'WhenValidator'
  },
  {
    name: 'zipCode',
    passes: ['12345'],
    fails: ['nope', '1234', '123456', undefined, null, /nope/, 0, {}, []],
    shortMessage: 'is not a valid zip code',
    validator: 'ZipCodeValidator'
  }
]

for (const test of tests) {
  tap.test(test.name, async t => {
    if (!test.skipCustom) {
      const customValidator = validate(t => {
        const args = [{
          error: 'custom error'
        }]
        if (typeof test.input !== 'undefined') {
          args.unshift(test.input)
        }
        t[test.name](...args)
      })

      const errors = []
      for await (const error of customValidator.validate(test.fails[0])) {
        errors.push(error)
      }

      t.equal(errors[0].shortMessage, 'custom error', 'supports custom error messages')
    }

    const validator = validate(t => {
      t[test.name](test.input)
    })

    for (const pass of test.passes) {
      await expectErrors(t, validator, pass, [])
    }

    for (const fail of test.fails) {
      await expectErrors(t, validator, fail, [
        new ValidationError(test.shortMessage, new Path(), test.validator)
      ])
    }
  })
}

// async
// each
// function
// value

tap.test('async', t => {
  t.test('nested', async t => {
    const validator = validate.async((t) => {
      t.validates('foo', {
        async * validate (record, path, value) {
          await new Promise((resolve, reject) => setTimeout(resolve, 100))
          yield JSON.stringify({
            record,
            path,
            value
          })
        }
      })
    })

    const data = {
      foo: 'bar'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    const expected = JSON.stringify({
      record: data,
      path: ['foo'],
      value: data.foo
    })

    t.deepEqual(errors[0].toString(), `Object: "foo" ${expected}`)
  })

  t.test('object', async t => {
    const validator = validate.async({
      async * validate (record, path, value) {
        await new Promise((resolve, reject) => setTimeout(resolve, 100))
        yield JSON.stringify({
          record,
          path,
          value
        })
      }
    })

    const data = {
      foo: 'bar'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    const expected = JSON.stringify({
      record: data,
      path: [],
      value: data
    })

    t.deepEqual(errors[0].toString(), `Object: "" ${expected}`)
  })

  t.end()
})

tap.test('each', t => {
  t.test('basic', async t => {
    const error = new Error('fail')
    const validator = validate(t => {
      t.validatesEach(['foo'], (record, value, path) => {
        if (path.navigate(value) === 'bar') {
          throw error
        }
      })
    })

    const data = {
      foo: 'bar',
      baz: 'buz'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    t.deepEqual(errors[0].toString(), `EachFunctionValidator: "" ${error}`)
  })

  t.test('generator', async t => {
    const error = new Error('fail')
    const validator = validate(t => {
      t.validatesEach(['foo'], function * (record, value, path) {
        if (path.navigate(value) === 'bar') {
          yield error
        }
      })
    })

    const data = {
      foo: 'bar',
      baz: 'buz'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    t.deepEqual(errors[0].toString(), `EachFunctionValidator: "" ${error}`)
  })

  t.end()
})

tap.test('function', t => {
  t.test('basic', async t => {
    const error = new Error('fail')
    const validator = validate(t => {
      t.validatesWith((record, path, value) => {
        if (path.navigate(value).foo === 'bar') {
          throw error
        }
      })
    })

    const data = {
      foo: 'bar',
      baz: 'buz'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    t.deepEqual(errors[0].toString(), `FunctionValidator: "" ${error}`)
  })

  t.test('generator', async t => {
    const error = new Error('fail')
    const validator = validate(t => {
      t.validatesWith(function * (record, path, value) {
        if (path.navigate(value).foo === 'bar') {
          yield error
        }
      })
    })

    const data = {
      foo: 'bar',
      baz: 'buz'
    }

    const errors = []
    for await (const error of validator.validate(data)) {
      errors.push(error)
    }

    t.deepEqual(errors[0].toString(), `FunctionValidator: "" ${error}`)
  })

  t.end()
})

tap.test('value', t => {
  t.test('nested', t => {
    const validator = validate((t) => {
      t.validates('foo', {
        * validate (record, path, value) {
          yield JSON.stringify({
            record,
            path,
            value
          })
        }
      })
    })

    const data = {
      foo: 'bar'
    }

    const errors = []
    for (const error of validator.validate(data)) {
      errors.push(error)
    }

    const expected = JSON.stringify({
      record: data,
      path: ['foo'],
      value: data.foo
    })

    t.deepEqual(errors[0].toString(), `Object: "foo" ${expected}`)
    t.end()
  })

  t.test('object', t => {
    const validator = validate({
      * validate (record, path, value) {
        yield JSON.stringify({
          record,
          path,
          value
        })
      }
    })

    const data = {
      foo: 'bar'
    }

    const errors = []
    for (const error of validator.validate(data)) {
      errors.push(error)
    }

    const expected = JSON.stringify({
      record: data,
      path: [],
      value: data
    })

    t.deepEqual(errors[0].toString(), `Object: "" ${expected}`)
    t.end()
  })

  t.end()
})
