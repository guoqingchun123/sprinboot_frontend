import { validate } from '@bestvike/utils'
describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validate.validUsername('admin')).toBe(true)
    expect(validate.validUsername('editor')).toBe(true)
    expect(validate.validUsername('xxxx')).toBe(false)
  })
  it('validURL', () => {
    expect(validate.validURL('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(validate.validURL('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(validate.validURL('github.com/PanJiaChen/vue-element-admin')).toBe(false)
  })
  it('validLowerCase', () => {
    expect(validate.validLowerCase('abc')).toBe(true)
    expect(validate.validLowerCase('Abc')).toBe(false)
    expect(validate.validLowerCase('123abc')).toBe(false)
  })
  it('validUpperCase', () => {
    expect(validate.validUpperCase('ABC')).toBe(true)
    expect(validate.validUpperCase('Abc')).toBe(false)
    expect(validate.validUpperCase('123ABC')).toBe(false)
  })
  it('validAlphabets', () => {
    expect(validate.validAlphabets('ABC')).toBe(true)
    expect(validate.validAlphabets('Abc')).toBe(true)
    expect(validate.validAlphabets('123aBC')).toBe(false)
  })
})
