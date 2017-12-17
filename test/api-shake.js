'use strict'
const Buffer = require('safe-buffer').Buffer
const test = require('tape')

module.exports = (name, createHash) => {
  test(`${name} Shake#update`, (t) => {
    t.test('only string or buffer is allowed', (t) => {
      const hash = createHash('shake256')

      t.throws(() => {
        hash.update(null)
      }, /^TypeError: Data must be a string or a buffer$/)
      t.end()
    })

    t.test('should throw error after Shake#squeeze', (t) => {
      const hash = createHash('shake256')

      hash.squeeze(32)
      t.throws(() => {
        hash.update('')
      }, /^Error: Squeeze already called$/)
      t.end()
    })

    t.test('should return `this`', (t) => {
      const hash = createHash('shake256')

      t.same(hash.update(Buffer.alloc(0)), hash)
      t.end()
    })

    t.end()
  })

  test(`${name} Shake#squeeze`, (t) => {
    t.test('should not throw error on second call', (t) => {
      const hash = createHash('shake256')

      hash.squeeze(16)
      t.doesNotThrow(() => {
        hash.squeeze(16)
      })
      t.end()
    })

    t.test('should return buffer by default', (t) => {
      const hash = createHash('shake256')

      t.true(Buffer.isBuffer(hash.squeeze(32)))
      t.end()
    })

    t.test('should encode result with custom encoding', (t) => {
      const hash = createHash('shake256')

      const squeeze = hash.squeeze(32, 'hex')
      t.equal(typeof squeeze, 'string')
      t.equal(squeeze.length, 64)
      t.end()
    })

    t.end()
  })

  test(`${name} Shake#_clone`, (t) => {
    t.test('should work', (t) => {
      const hash1 = createHash('shake256')
      const hash2 = hash1._clone()

      const squeezed1 = hash1.squeeze(32, 'hex')
      t.throws(() => {
        hash1.update(Buffer.alloc(0))
      }, /^Error: Squeeze already called$/)
      t.equal(hash2.squeeze(32, 'hex'), squeezed1)

      t.end()
    })

    t.end()
  })
}
