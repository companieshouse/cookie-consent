import { expect } from 'chai'
import { createJSDOM, defaultAcceptedCookie, defaultHTML, defaultURL } from '../test-utilities'
import { createCookie } from '../../src/cookie-management'
import { COOKIES } from '../../src/constants'
import { CHCookie } from '../../src/types'

const cleanup = createJSDOM()

describe('Create cookie tests', () => {
  afterEach(cleanup)
  it('creates a cookie named using COOKIE_NAME constant, with whatever CHCookie value is passed', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }
    createJSDOM(defaultHTML, { url: defaultURL })

    createCookie(cookie)

    expect(document.cookie).to.contain(defaultAcceptedCookie)
  })
})
