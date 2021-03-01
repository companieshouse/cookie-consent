import { expect, use } from 'chai'
import { COOKIES } from '../../src/constants'
import { haveAllCookiesBeenAccepted } from '../../src/cookie-management'
import dirtyChai = require('dirty-chai')

use(dirtyChai)

describe('Have all cookies been accepted tests', () => {
  it('returns false if the cookie array length is different to COOKIES constant', () => {
    const cookieArrayPlusOne = [...COOKIES, 'newCookie']
    const firstReturnValue = haveAllCookiesBeenAccepted(cookieArrayPlusOne)
    expect(firstReturnValue).to.be.false()

    const cookieArrayMinusOne = COOKIES.slice(0, COOKIES.length - 1)
    const secondReturnValue = haveAllCookiesBeenAccepted(cookieArrayMinusOne)
    expect(secondReturnValue).to.be.false()
  })

  it('returns false if the cookie array is different to COOKIES constant', () => {
    const cookieArray = COOKIES.map((elem, idx) => `${elem}-${idx}`)
    const returnValue = haveAllCookiesBeenAccepted(cookieArray)
    expect(returnValue).to.be.false()
  })

  it('returns true if the cookie array matches the COOKIES constant', () => {
    const returnValue = haveAllCookiesBeenAccepted(COOKIES)
    expect(returnValue).to.be.true()
  })
})
