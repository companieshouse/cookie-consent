import { expect } from 'chai'
import { createJSDOM, defaultAcceptedCookie, defaultHTML, defaultURL } from '../test-utilities'
import { getCookieObject } from '../../src/cookie-management'
import { COOKIES } from '../../src/constants'
import { CHCookie } from '../../src/types'
import { CookieJar } from 'jsdom'

const cleanup = createJSDOM()

describe('Get cookie object tests', () => {
  afterEach(cleanup)
  it('returns a cookie object if the cookie name matches COOKIE_NAME constant and it is the only cookie', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultAcceptedCookie, defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const cookieObject = getCookieObject()

    expect(cookieObject).to.eql(cookie)
  })

  it('returns a cookie object if the cookie name matches COOKIE_NAME constant and it is one of multiple cookies', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultAcceptedCookie, defaultURL, (x) => console.log)
    cookieJar.setCookie('foo=bar', defaultURL, (x) => console.log)
    cookieJar.setCookie('bar=baz', defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const cookieObject = getCookieObject()

    expect(cookieObject).to.eql(cookie)
  })

  it('returns the default cookie object if cookies are set but none match the COOKIE_NAME constant', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'unset',
      cookiesAllowed: []
    }

    const cookieJar = new CookieJar()
    cookieJar.setCookie('foo=bar', defaultURL, (x) => console.log)
    cookieJar.setCookie('bar=baz', defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const cookieObject = getCookieObject()

    expect(cookieObject).to.eql(cookie)
  })

  it('returns the default cookie object if no cookies are set', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'unset',
      cookiesAllowed: []
    }

    createJSDOM(defaultHTML)

    const cookieObject = getCookieObject()

    expect(cookieObject).to.eql(cookie)
  })
})
